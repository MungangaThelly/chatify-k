import { useEffect, useState } from 'react';
import { getMessages, createMessage, deleteMessage } from '../api';
import { useAuth } from '../context/AuthContext';
import SideNav from '../components/SideNav';
import './Chat.css';

const Chat = () => {
  const { user, setUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await getMessages();
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Enkel sanitering – förhindra farlig HTML
  const sanitize = (str) =>
    str.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    try {
      await createMessage({ text: sanitize(newMsg) });
      setNewMsg('');
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMessage(id);
      fetchMessages();
    } catch (err) {
      console.error(err);
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
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.userId === user.id ? 'own' : 'other'}`}
            >
              <p>{msg.text}</p>
              {msg.userId === user.id && (
                <button onClick={() => handleDelete(msg.id)}>Ta bort</button>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Skriv ett meddelande..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
          />
          <button type="submit">Skicka</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
