package com.oumaimabimesmaren.studentsystem.added.websocket;

import com.oumaimabimesmaren.studentsystem.model.Message;
import com.oumaimabimesmaren.studentsystem.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class MessageWebSocketHandler {

    @Autowired
    private MessageService messageService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload Message message, SimpMessageHeaderAccessor headerAccessor) {
        // Save the message
        Message savedMessage = messageService.saveMessage(message);
        
        // Send to the specific conversation
        messagingTemplate.convertAndSend(
            "/topic/conversation." + message.getConversation().getId(),
            savedMessage
        );
        
        // Send to the specific user if they're online
        messagingTemplate.convertAndSendToUser(
            message.getConversation().getOrganizer().getId().toString(),
            "/queue/messages",
            savedMessage
        );
    }

    @MessageMapping("/chat.typing")
    public void handleTyping(@Payload TypingNotification notification) {
        messagingTemplate.convertAndSend(
            "/topic/conversation." + notification.getConversationId(),
            notification
        );
    }
} 