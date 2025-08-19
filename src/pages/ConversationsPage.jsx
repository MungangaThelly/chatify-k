import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from '../components/SideNav';
import { getConversations } from '../api';
import './ConversationsPage.css';

const ConversationsPage = () => {
  const [conversations, setConversations] = useState([]);
  const [invitesReceived, setInvitesReceived] = useState([]);
  const [invitesSent, setInvitesSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getConversations();
        const data = res.data || {};

        setConversations(data.participating || []);
        setInvitesReceived(data.invitesReceived || []);
        setInvitesSent(data.invitesSent || []);
      } catch (err) {
        console.error('Error loading conversations:', err);
        setError('Failed to load conversations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const goToChat = (conversationId, botActive = false) => {
    localStorage.setItem(`botActive-${conversationId}`, JSON.stringify(botActive));
    navigate(`/chat/${conversationId}`);
  };

  const handleAcceptInvite = (inviteId) => {
    goToChat(inviteId, false);
  };

  if (loading) return <p className="loading">Loading conversations...</p>;

  return (
    <div className="chat-container">
      <SideNav activeItem="conversations" />
      <div className="chat-content">
        <h2>My Conversations</h2>

        {error && <p className="error-message">{error}</p>}

        {conversations.length === 0 ? (
          <p className="empty-message">You have no conversations yet.</p>
        ) : (
          <ul className="conversation-list">
            {conversations.map((id) => (
              <li key={id} className="conversation-item">
                Conversation ID: {id.slice(0, 8)}...
              </li>
            ))}
          </ul>
        )}

        <h3>Invites Received</h3>
        {invitesReceived.length === 0 ? (
          <p className="empty-message">No invites received.</p>
        ) : (
          <ul className="invite-list">
            {invitesReceived.map((inviteId) => (
              <li key={inviteId} className="invite-item invite-received">
                Invite ID: {inviteId.slice(0, 8)}...
                <button onClick={() => handleAcceptInvite(inviteId)}>Accept & Connect</button>
              </li>
            ))}
          </ul>
        )}

        <h3>Invites Sent</h3>
        {invitesSent.length === 0 ? (
          <p className="empty-message">No invites sent.</p>
        ) : (
          <ul className="invite-list">
            {invitesSent.map((id) => (
              <li key={id} className="invite-item invite-sent">
                Invite Sent ID: {id.slice(0, 8)}...
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConversationsPage;
