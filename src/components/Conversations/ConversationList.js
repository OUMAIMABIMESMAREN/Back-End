import React, { useState, useEffect } from 'react';
import { conversationService } from '../../services/conversationService';
import { authService } from '../../services/authService';
import './ConversationList.css';

const ConversationList = ({ onSelectConversation, selectedConversationId }) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const userId = authService.getUserId();
            const userRole = authService.getUserRole();
            
            const data = userRole === 'PARTICIPANT' 
                ? await conversationService.getParticipantConversations(userId)
                : await conversationService.getOrganizerConversations(userId);
            
            setConversations(data);
            setError(null);
        } catch (err) {
            setError('Failed to load conversations');
            console.error('Error fetching conversations:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleConversationClick = async (conversation) => {
        try {
            await conversationService.markConversationAsRead(conversation.id);
            onSelectConversation(conversation);
            // Update the conversation in the list
            setConversations(prev => 
                prev.map(c => c.id === conversation.id 
                    ? { ...c, unreadCount: 0 }
                    : c
                )
            );
        } catch (err) {
            console.error('Error marking conversation as read:', err);
        }
    };

    if (loading) {
        return <div className="conversation-list-loading">Loading conversations...</div>;
    }

    if (error) {
        return <div className="conversation-list-error">{error}</div>;
    }

    return (
        <div className="conversation-list">
            <h2>Conversations</h2>
            {conversations.length === 0 ? (
                <div className="no-conversations">No conversations yet</div>
            ) : (
                <div className="conversation-items">
                    {conversations.map(conversation => (
                        <div
                            key={conversation.id}
                            className={`conversation-item ${selectedConversationId === conversation.id ? 'selected' : ''}`}
                            onClick={() => handleConversationClick(conversation)}
                        >
                            <div className="conversation-header">
                                <span className="conversation-name">
                                    {authService.getUserRole() === 'PARTICIPANT'
                                        ? conversation.organizerName
                                        : conversation.participantName}
                                </span>
                                {conversation.unreadCount > 0 && (
                                    <span className="unread-badge">{conversation.unreadCount}</span>
                                )}
                            </div>
                            <div className="conversation-preview">
                                {conversation.lastMessageDate && (
                                    <span className="last-message-date">
                                        {new Date(conversation.lastMessageDate).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ConversationList; 