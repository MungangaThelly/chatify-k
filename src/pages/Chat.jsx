import { useEffect, useState, useCallback, useRef } from 'react';
import { getMessages, createMessage, deleteMessage, getConversations } from '../api';
import { useAuth } from '../context/AuthContext';
import SideNav from '../components/SideNav';
import DOMPurify from 'dompurify';
import './Chat.css';

// Configure DOMPurify
DOMPurify.addHook('uponSanitizeElement', (node, data) => {
  if (node.hasAttribute('style')) node.removeAttribute('style');
  if (data.tagName === 'a') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize conversations
  useEffect(() => {
    const initializeConversations = async () => {
      try {
        const res = await getConversations(user.id);
        if (res.data.length === 0) {
          // Create initial conversations if none exist
          const initialConvs = [
            { id: crypto.randomUUID(), title: 'General Chat' },
            { id: crypto.randomUUID(), title: 'Support' }
          ];
          setConversations(initialConvs);
          setActiveConversation(initialConvs[0].id);
          sessionStorage.setItem('conversationId', initialConvs[0].id);
        } else {
          setConversations(res.data);
          setActiveConversation(res.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load conversations:', err);
      }
    };

    initializeConversations();
  }, [user.id]);

  // Fetch messages when active conversation changes
  const fetchMessages = useCallback(async () => {
    if (!activeConversation) return;
    
    const controller = new AbortController();
    try {
      setLoading(true);
      setError(null);
      const res = await getMessages(activeConversation, { signal: controller.signal });
      
      const sanitizedMessages = res.data.map(msg => ({
        ...msg,
        text: DOMPurify.sanitize(msg.text)
      }));
      
      setMessages(sanitizedMessages);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Failed to fetch messages:', err);
        setError('Could not load messages. Please try again.');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }

    return () => controller.abort();
  }, [activeConversation]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = newMsg.trim();
    if (!trimmed || isSending) return;

    try {
      setIsSending(true);
      await createMessage({ 
        text: DOMPurify.sanitize(trimmed), 
        conversationId: activeConversation,
        userId: user.id 
      });
      setNewMsg('');
      await fetchMessages();
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Could not send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await deleteMessage(id, activeConversation);
      await fetchMessages();
    } catch (err) {
      console.error('Failed to delete message:', err);
      setError('Could not delete message. Please try again.');
    }
  };

  const switchConversation = (convId) => {
    setActiveConversation(convId);
    sessionStorage.setItem('conversationId', convId);
  };

  return (
    <div className="chat-container">
      <SideNav />

      <div className="chat-content">
        <div className="conversation-selector">
          {conversations.map(conv => (
            <button
              key={conv.id}
              className={`conv-btn ${activeConversation === conv.id ? 'active' : ''}`}
              onClick={() => switchConversation(conv.id)}
            >
              {conv.title}
            </button>
          ))}
        </div>

        <div className="chat-header">
          <span>Chat: {conversations.find(c => c.id === activeConversation)?.title}</span>
          <span className="conversation-id">ID: {activeConversation}</span>
        </div>
          <div className="chat-messages">
            {loading ? (
              <p>Loading messages...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : messages.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              messages.map(msg => {
                const isOwnMessage = msg.userId === user.id;
                return (
                  <div
                    key={msg.id}
                    className={`chat-message ${isOwnMessage ? 'own' : 'other'}`}
                  >
                    <div className="msg-header">
                      <strong>{isOwnMessage ? 'You' : msg.user?.username || 'Anonymous'}:</strong>
                      {isOwnMessage && (
                        <button className="delete-btn" onClick={() => handleDelete(msg.id)}>Delete</button>
                      )}
                    </div>
                    <p dangerouslySetInnerHTML={{ __html: msg.text }} />
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>


          <form className="chat-input-form" onSubmit={handleSend}>
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type your message..."
                className="chat-input"
              />
              <button type="submit" className="send-button" disabled={isSending}>
                {isSending ? 'Sending...' : 'Send'}
              </button>
          </form>

      </div>
    </div>
  );
};

export default Chat;