import { useEffect, useState } from 'react';
import { getConversations } from '../api';
import SideNav from '../components/SideNav';

const ConversationsPage = () => {
  const [conversations, setConversations] = useState([]);
  const [invitesSent, setInvitesSent] = useState([]);
  const [invitesReceived, setInvitesReceived] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getConversations();

        // 💡 Defensive fallback if API shape isn't guaranteed
        const data = res?.data || {};

        setConversations(data.conversations || []);
        setInvitesSent(data.invitesSent || []);
        setInvitesReceived(data.invitesReceived || []);
      } catch (err) {
        console.error('Error loading conversations:', err);
        // Optionally set fallback empty state
        setConversations([]);
        setInvitesSent([]);
        setInvitesReceived([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="chat-container">
      <SideNav activeItem="conversations" />

      <div className="chat-content">
        <h2>My Conversations</h2>
        <ul>
          {conversations.map((c) => (
            <li key={c.id}>Conversation with {c.participantName || c.id}</li>
          ))}
        </ul>

        <h3>Invites Received</h3>
        <ul>
          {invitesReceived.map((invite) => (
            <li key={invite.id}>From: {invite.senderName}</li>
          ))}
        </ul>

        <h3>Invites Sent</h3>
        <ul>
          {invitesSent.map((invite) => (
            <li key={invite.id}>To: {invite.recipientName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ConversationsPage;
