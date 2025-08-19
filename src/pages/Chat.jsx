import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SideNav from '../components/SideNav';
import { getMessages, createMessage, deleteMessage, getUser } from '../api';
import './Chat.css';

const Chat = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isBotActive, setIsBotActive] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { state } = location;
  const conversationId = state?.conversationId;

  const fakeBotUser = {
    id: 'bot-001',
    username: 'Support Bot',
    avatar: 'https://i.pravatar.cc/150?img=5',
  };

  const botResponses = [
    "I'm checking that for you.",
    "Could you give me more details?",
    "Thank you for reaching out!",
    "We're working on your issue.",
    "Please hold on a moment.",
    "That's a great question!",
    "Let me escalate that to our team.",
    "You're doing great!",
    "Can I help you with anything else?",
    "Thanks for your patience!",
  ];

  const fetchParticipantsFromMessages = async (messages) => {
    // Hämta unika användar-ID:n utom botar
    const uniqueUserIds = [...new Set(messages.map(m => m.userId))].filter(id => id !== fakeBotUser.id);

    try {
      const users = await Promise.all(
        uniqueUserIds.map(id => getUser(id).then(res => res.data))
      );
      setParticipants(users);
    } catch (err) {
      console.error('Error fetching participants:', err);
      setParticipants([]);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await getMessages({ conversationId });
      const data = response.data;

      const localBotActive = localStorage.getItem(`botActive-${conversationId}`);
      const isBotAllowed = localBotActive === null ? true : JSON.parse(localBotActive);
      setIsBotActive(isBotAllowed);

      if (data.length === 0 && isBotAllowed) {
        const welcomeMessage = {
          id: crypto.randomUUID(),
          text: "👋 Hello! Welcome. How can I help you today?",
          userId: fakeBotUser.id,
          user: fakeBotUser,
          createdAt: new Date(),
        };
        setMessages([welcomeMessage]);
        setParticipants([]); // inga andra användare ännu
      } else {
        setMessages(data);
        await fetchParticipantsFromMessages(data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  useEffect(() => {
    setParticipants([]);
    fetchMessages(conversationId);
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isSending && !isBotTyping) {
      inputRef.current?.focus();
    }
  }, [isSending, isBotTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = newMsg.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    setNewMsg('');

    try {
      await createMessage({ text: trimmed, conversationId });
      await fetchMessages(conversationId);

      if (isBotActive) {
        setIsBotTyping(true);

        setTimeout(() => {
          const latestBotFlag = localStorage.getItem(`botActive-${conversationId}`);
          const isStillBotActive = latestBotFlag === null ? true : JSON.parse(latestBotFlag);

          if (!isStillBotActive) {
            setIsBotTyping(false);
            return;
          }

          const randomReply = botResponses[Math.floor(Math.random() * botResponses.length)];

          const botMessage = {
            id: crypto.randomUUID(),
            text: randomReply,
            userId: fakeBotUser.id,
            user: fakeBotUser,
            createdAt: new Date(),
          };

          setMessages(prev => [...prev, botMessage]);
          setIsBotTyping(false);
        }, 1000 + Math.random() * 1500);
      }
    } catch (err) {
      console.error('Error sending or simulating bot response:', err);
      setIsBotTyping(false);
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

  const handleDisableBot = () => {
    localStorage.setItem(`botActive-${conversationId}`, JSON.stringify(false));
    setIsBotActive(false);
    setIsBotTyping(false);
  };

  const handleEnableBot = () => {
    localStorage.setItem(`botActive-${conversationId}`, JSON.stringify(true));
    setIsBotActive(true);

    const welcomeBackMessage = {
      id: crypto.randomUUID(),
      text: "✅ Bot re-enabled. I'm here to help again!",
      userId: fakeBotUser.id,
      user: fakeBotUser,
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, welcomeBackMessage]);
  };

  return (
    <div className="chat-container">
      <SideNav activeItem="chat" />
      <div className="chat-content">
        <div className="bot-toggle-button">
          {isBotActive ? (
            <button className="disable-bot-button" onClick={handleDisableBot}>
              Disable Bot
            </button>
          ) : (
            <button className="enable-bot-button" onClick={handleEnableBot}>
              Enable Bot
            </button>
          )}
        </div>

        <div className="messages-container">
          <div className="messages-list" role="log" aria-live="polite">
            {messages.map((msg) => {
              const isOwn = msg.userId === user.id;
              const isBot = msg.userId === fakeBotUser.id;

              return (
                <div
                  key={msg.id}
                  className={`message ${isOwn ? 'message-right' : 'message-left'} ${isBot ? 'message-bot' : ''}`}
                >
                  {!isOwn && (
                    <div className="message-sender">
                      {isBot
                        ? fakeBotUser.username
                        : participants.find(p => p.id === msg.userId)?.username || 'user'}
                    </div>
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

            {isBotTyping && (
              <div className="message message-left message-bot">
                <div className="message-sender">{fakeBotUser.username}</div>
                <div className="message-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

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
            disabled={isSending || isBotTyping}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!newMsg.trim() || isSending || isBotTyping}
            aria-label="Send message"
          >
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
