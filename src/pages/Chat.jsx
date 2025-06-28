import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import SideNav from '../components/SideNav';
import './Chat.css';

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Fake användarens data
  const fakeUser = {
    id: 'fake-user-123',
    username: 'Support',
    avatar: 'https://i.pravatar.cc/150?img=5'
  };

  // Initialize with some fake messages
  useEffect(() => {
    const initialMessages = [
      {
        id: '1',
        text: 'Hello! How can I help you today?',
        userId: fakeUser.id,
        user: fakeUser,
        createdAt: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        text: 'Welcome to our support chat!',
        userId: fakeUser.id,
        user: fakeUser,
        createdAt: new Date(Date.now() - 1800000)
      }
    ];
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = newMsg.trim();
    if (!trimmed || isSending) return;

    // Add user's message
    const userMessage = {
      id: Date.now().toString(),
      text: trimmed,
      userId: user.id,
      user: user,
      createdAt: new Date(),
      isOwn: true
    };

    setIsSending(true);
    setMessages(prev => [...prev, userMessage]);
    setNewMsg('');

    // Simulate response after a delay
    setTimeout(() => {
      const responses = [
        "Here we are.","We did it.","Really — made it.","Through the noise, the doubt,","the days we almost quit."
        ,"But we didn't.","Congratulations, genius.","(Not for being perfect but for staying.)","See?","It’s just a game.",
        "You win some, you learn some.","Play it.","Have fun.","Don’t forget to laugh when it all feels too heavy.",
        "Especially then.","This is it — Life.","Not the plan.","Not the past.","Just this breath.","This moment.",
        "Us, here.","And that’s enough.","I understand your question.","Let me check that for you.","That's a good point!",
        "Please, provide mode details?","We'll look into this issue.","Keep in touch, so long!","Thanks for your feedback!"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        userId: fakeUser.id,
        user: fakeUser,
        createdAt: new Date(),
        isOwn: false
      };

      setMessages(prev => [...prev, botMessage]);
      setIsSending(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  return (
    <div className="chat-container">
      <SideNav activeItem="chat"/>

      <div className="chat-content">
        <div className="chat-header">
          <h2>Support Chat</h2>
        </div>

        <div className="messages-container">
          <div className="messages-list">
            {messages.map(msg => {
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
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
          <label htmlFor="chat-message" className="visually-hidden">
            Message
          </label>
          <input
            type="text"
            id="chat-message"
            name="chatMessage"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Type your message..."
            disabled={isSending}
            autoComplete="off"
          />
          <button 
            type="submit" 
            disabled={!newMsg.trim() || isSending}
            aria-label="Send message"
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </form>

        <div className="chat-footer">
        © {new Date().getFullYear()} Chatify-k(munganga). All rights reserved.
      </div>
      </div>
    </div>
  );
};

export default Chat;