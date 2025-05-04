package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.dto.MessageDTO;
import com.oumaimabimesmaren.studentsystem.dto.MessageResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Message;
import com.oumaimabimesmaren.studentsystem.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired private MessageService messageService;

    @PostMapping
    public MessageResponseDTO sendMessage(@RequestBody MessageDTO dto) {
        return messageService.sendMessage(dto);
    }

    @GetMapping("/inbox/{userId}")
    public List<MessageResponseDTO> getInbox(@PathVariable Long userId) {
        return messageService.getInbox(userId);
    }
    @GetMapping("/sent/{userId}")
    public List<MessageResponseDTO> getSentMessages(@PathVariable Long userId) {
        return messageService.getSentMessages(userId);
    }

    @PutMapping("/{messageId}/read")
    public MessageResponseDTO markAsRead(@PathVariable Long messageId) {
        return messageService.markAsRead(messageId);
    }

    @DeleteMapping("/{messageId}")
    public void deleteMessage(@PathVariable Long messageId) {
        messageService.deleteMessage(messageId);
    }

    @DeleteMapping("/inbox/{userId}")
    public void clearInbox(@PathVariable Long userId) {
        messageService.clearInbox(userId);
    }

    @GetMapping("/unread/{userId}")
    public int getUnreadCount(@PathVariable Long userId) {
        return messageService.getUnreadCount(userId);
    }
}