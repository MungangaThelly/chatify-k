import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import SideNav from '../components/SideNav';
import { getMessages, createMessage, deleteMessage } from '../api'; // Make sure these are correctly exported
import './Chat.css';

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Simulated bot user
  const fakeBotUser = {
    id: 'bot-001',
    username: 'Support Bot',
    avatar: 'https://i.pravatar.cc/150?img=5',
  };

  // Predefined bot replies
  const botResponses = [
    "I'm checking that for you.",
    "Could you give me more details?",
    "Thank you for reaching out!",
    "We're working on your issue.",
    "Please hold on a moment.",
    "That’s a great question!",
    "Let me escalate that to our team.",
    "You're doing great!",
    "Can I help you with anything else?",
    "Thanks for your patience!",
  ];

  // Load messages from backend
  const fetchMessages = async () => {
    try {
      const response = await getMessages(); // Make sure it returns { data: [...] }
      setMessages(response.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await getMessages();
        const data = response.data;

        if (data.length === 0) {
          // Inject a simulated welcome message if chat is empty
          const welcomeMessage = {
            id: crypto.randomUUID(),
            text: "👋 Hello! How can I help you today?",
            userId: fakeBotUser.id,
            user: fakeBotUser,
            createdAt: new Date(),
          };
          setMessages([welcomeMessage]);
        } else {
          setMessages(data);
        }
      } catch (err) {
        console.error('Error loading messages:', err);
      }
    };

    loadMessages();
  }, []);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isSending) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isSending]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = newMsg.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    setNewMsg('');

    try {
      // Send user's message
      await createMessage({ text: trimmed });
      await fetchMessages();   // Reload messages

      // Simulate bot response after delay
      setTimeout(() => {
        const randomReply = botResponses[Math.floor(Math.random() * botResponses.length)];

        const botMessage = {
          id: crypto.randomUUID(),
          text: randomReply,
          userId: fakeBotUser.id,
          user: fakeBotUser,
          createdAt: new Date(),
        };

        setMessages(prev => [...prev, botMessage]);
      }, 1000 + Math.random() * 1500);
    } catch (err) {
      console.error('Error sending or simulating bot response:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Do you want to delete this message?')) return;

    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  return (
    <div className="chat-container">
      <SideNav activeItem="chat" />
      <div className="chat-content">
        <div className="chat-header"><h2>Support Chat</h2></div>

        <div className="messages-container">
          <div className="messages-list" role="log" aria-live="polite">
            {messages.map((msg) => {
              const isOwn = msg.userId === user.id;
              return (
                <div
                  key={msg.id}
                  className={`message ${isOwn ? 'message-right' : 'message-left'}`}
                >
                  {!isOwn && (
                    <div className="message-sender">{msg.user?.username || 'Support'}</div>
                  )}
                  <div className="message-bubble">
                    <p>{msg.text}</p>
                    <div className="message-meta">
                      <span className="message-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {isOwn && (
                        <button
                          className="message-delete"
                          onClick={() => handleDelete(msg.id)}
                          aria-label="Delete message"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form className="message-form" onSubmit={handleSend}>
          <label htmlFor="chat-message" className="visually-hidden">Message</label>
          <input
            ref={inputRef}
            type="text"
            id="chat-message"
            name="chatMessage"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Type your message..."
            disabled={isSending}
            autoComplete="off"
          />
          <button type="submit" disabled={!newMsg.trim() || isSending} aria-label="Send message">
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </form>

        <div className="chat-footer">
          © {new Date().getFullYear()} Chatify‑k(munganga). All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Chat;
