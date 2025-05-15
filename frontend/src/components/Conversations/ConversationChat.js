import React, { useState, useEffect, useRef } from 'react';
import { messageService } from '../../services/messageService';
import { authService } from '../../services/authService';
import './ConversationChat.css';

const ConversationChat = ({ conversation }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingUsers, setTypingUsers] = useState(new Set());
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        if (conversation) {
            // Connect to WebSocket if not already connected
            messageService.connect().then(() => {
                // Subscribe to conversation
                messageService.subscribeToConversation(
                    conversation.id,
                    handleNewMessage,
                    handleTypingNotification
                );
            });

            // Load initial messages
            if (conversation.messages) {
                setMessages(conversation.messages);
            }
        }

        return () => {
            if (conversation) {
                messageService.unsubscribeFromConversation(conversation.id);
            }
        };
    }, [conversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleNewMessage = (message) => {
        setMessages(prev => [...prev, message]);
    };

    const handleTypingNotification = (notification) => {
        if (notification.userId !== authService.getUserId()) {
            if (notification.isTyping) {
                setTypingUsers(prev => new Set([...prev, notification.userName]));
            } else {
                setTypingUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(notification.userName);
                    return newSet;
                });
            }
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        messageService.sendMessage(conversation.id, newMessage.trim());
        setNewMessage('');
    };

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
        
        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Send typing notification
        messageService.sendTypingNotification(conversation.id, true);

        // Set new timeout
        typingTimeoutRef.current = setTimeout(() => {
            messageService.sendTypingNotification(conversation.id, false);
        }, 3000);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (!conversation) {
        return <div className="no-conversation-selected">Select a conversation to start chatting</div>;
    }

    return (
        <div className="conversation-chat">
            <div className="chat-header">
                <h3>
                    {authService.getUserRole() === 'PARTICIPANT'
                        ? conversation.organizerName
                        : conversation.participantName}
                </h3>
            </div>

            <div className="messages-container">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${message.senderId === authService.getUserId() ? 'sent' : 'received'}`}
                    >
                        <div className="message-content">{message.content}</div>
                        <div className="message-timestamp">
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {typingUsers.size > 0 && (
                <div className="typing-indicator">
                    {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
                </div>
            )}

            <form onSubmit={handleSendMessage} className="message-input-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="message-input"
                />
                <button type="submit" className="send-button" disabled={!newMessage.trim()}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default ConversationChat; 