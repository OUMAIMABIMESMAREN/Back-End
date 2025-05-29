import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { authService } from './authService';

class MessageService {
    constructor() {
        this.stompClient = null;
        this.subscriptions = new Map();
        this.typingTimeouts = new Map();
    }

    connect() {
        if (this.stompClient && this.stompClient.connected) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const socket = new SockJS('http://localhost:8080/ws');
            this.stompClient = new Client({
                webSocketFactory: () => socket,
                onConnect: () => {
                    console.log('Connected to WebSocket');
                    resolve();
                },
                onStompError: (frame) => {
                    console.error('STOMP error:', frame);
                    reject(frame);
                }
            });

            this.stompClient.activate();
        });
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.deactivate();
            this.stompClient = null;
        }
    }

    subscribeToConversation(conversationId, onMessage, onTyping) {
        if (!this.stompClient || !this.stompClient.connected) {
            throw new Error('WebSocket not connected');
        }

        // Subscribe to conversation messages
        const messageSubscription = this.stompClient.subscribe(
            `/topic/conversation.${conversationId}`,
            (message) => {
                const data = JSON.parse(message.body);
                if (data.type === 'typing') {
                    onTyping?.(data);
                } else {
                    onMessage?.(data);
                }
            }
        );

        // Subscribe to user-specific messages
        const userId = authService.getUserId();
        const userSubscription = this.stompClient.subscribe(
            `/user/${userId}/queue/messages`,
            (message) => {
                const data = JSON.parse(message.body);
                onMessage?.(data);
            }
        );

        this.subscriptions.set(conversationId, [messageSubscription, userSubscription]);
    }

    unsubscribeFromConversation(conversationId) {
        const subscriptions = this.subscriptions.get(conversationId);
        if (subscriptions) {
            subscriptions.forEach(sub => sub.unsubscribe());
            this.subscriptions.delete(conversationId);
        }
    }

    sendMessage(conversationId, content) {
        if (!this.stompClient || !this.stompClient.connected) {
            throw new Error('WebSocket not connected');
        }

        const message = {
            conversationId,
            content,
            senderId: authService.getUserId(),
            timestamp: new Date().toISOString()
        };

        this.stompClient.publish({
            destination: '/app/chat.send',
            body: JSON.stringify(message)
        });
    }

    sendTypingNotification(conversationId, isTyping) {
        if (!this.stompClient || !this.stompClient.connected) {
            return;
        }

        // Clear existing timeout
        if (this.typingTimeouts.has(conversationId)) {
            clearTimeout(this.typingTimeouts.get(conversationId));
        }

        const notification = {
            conversationId,
            userId: authService.getUserId(),
            userName: authService.getUserName(),
            isTyping
        };

        this.stompClient.publish({
            destination: '/app/chat.typing',
            body: JSON.stringify(notification)
        });

        // Set timeout to send "not typing" notification after 3 seconds
        if (isTyping) {
            const timeout = setTimeout(() => {
                this.sendTypingNotification(conversationId, false);
            }, 3000);
            this.typingTimeouts.set(conversationId, timeout);
        }
    }
}

export const messageService = new MessageService(); 