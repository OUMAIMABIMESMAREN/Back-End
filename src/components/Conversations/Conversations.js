import React, { useState, useEffect } from 'react';
import ConversationList from './ConversationList';
import ConversationChat from './ConversationChat';
import { conversationService } from '../../services/conversationService';
import { authService } from '../../services/authService';
import './Conversations.css';

const Conversations = () => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const userId = authService.getUserId();
                const count = await conversationService.getUnreadConversationCount(userId);
                setUnreadCount(count);
            } catch (error) {
                console.error('Error fetching unread count:', error);
            }
        };

        fetchUnreadCount();
        // Set up polling for unread count
        const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const handleSelectConversation = async (conversation) => {
        try {
            // Fetch full conversation details
            const fullConversation = await conversationService.getConversation(conversation.id);
            setSelectedConversation(fullConversation);
        } catch (error) {
            console.error('Error fetching conversation details:', error);
        }
    };

    return (
        <div className="conversations-container">
            <ConversationList
                onSelectConversation={handleSelectConversation}
                selectedConversationId={selectedConversation?.id}
            />
            <ConversationChat conversation={selectedConversation} />
        </div>
    );
};

export default Conversations; 