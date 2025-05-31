import { useEffect, useState } from 'react';
import { getMessages, createMessage, deleteMessage } from '../api';
import { useAuth } from '../context/AuthContext';
import SideNav from '../components/SideNav';
import './Chat.css';

const Chat = () => {
  const { user, setUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [conversationId, setConversationId] = useState(() => {
    // Skapa eller hämta befintligt samtals-ID
    const savedId = sessionStorage.getItem('conversationId');
    if (savedId) return savedId;

    const newId = crypto.randomUUID();
    sessionStorage.setItem('conversationId', newId);
    return newId;
  });

  useEffect(() => {
    fetchMessages();
  }, [conversationId]); // Uppdatera om samtals-ID ändras

  useEffect(() => {
    const container = document.querySelector('.messages-list');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await getMessages(conversationId);
      setMessages(res.data);
    } catch (err) {
      console.error('Kunde inte hämta meddelanden:', err);
    } finally {
      setLoading(false);
    }
  };

  const sanitize = (str) =>
    str.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = newMsg.trim();
    if (!trimmed) return;

    try {
      await createMessage({ text: sanitize(trimmed), conversationId });
      setNewMsg('');
      fetchMessages();
    } catch (err) {
      console.error('Kunde inte skicka meddelande:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMessage(id, conversationId);
      fetchMessages();
    } catch (err) {
      console.error('Kunde inte ta bort meddelande:', err);
    }
  };

  return (
    <div className="chat-container">
      <SideNav user={user} setUser={setUser} />

      <div className="chat-content">
        <div className="chat-header">
          <img src={user.avatar} alt={user.username} className="avatar" />
          <span>{user.username}</span>
        </div>

        <div className="messages-list">
          {loading ? (
            <p>Laddar meddelanden...</p>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.userId === user.id;
              return (
                <div
                  key={msg.id}
                  className={`message-bubble ${isOwn ? 'own' : 'other'}`}
                >
                  <p>{msg.text}</p>
                  {isOwn && (
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(msg.id)}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={handleSend} className="message-form">
          <input
            type="text"
            placeholder="Skriv ett meddelande..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !newMsg.trim()}>
            Skicka
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
