package com.oumaimabimesmaren.studentsystem.added.controller;

import com.oumaimabimesmaren.studentsystem.added.dto.ConversationResponseDTO;
import com.oumaimabimesmaren.studentsystem.added.service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@CrossOrigin(origins = "http://localhost:3000")
public class ConversationController {

    @Autowired
    private ConversationService conversationService;

    @PostMapping("/create")
    public ResponseEntity<ConversationResponseDTO> createConversation(
            @RequestParam Long participantId,
            @RequestParam Long organizerId) {
        return ResponseEntity.ok(conversationService.createConversation(participantId, organizerId));
    }

    @GetMapping("/participant/{participantId}")
    public ResponseEntity<List<ConversationResponseDTO>> getParticipantConversations(
            @PathVariable Long participantId) {
        return ResponseEntity.ok(conversationService.getParticipantConversations(participantId));
    }

    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<List<ConversationResponseDTO>> getOrganizerConversations(
            @PathVariable Long organizerId) {
        return ResponseEntity.ok(conversationService.getOrganizerConversations(organizerId));
    }

    @GetMapping("/{conversationId}")
    public ResponseEntity<ConversationResponseDTO> getConversation(
            @PathVariable Long conversationId) {
        return ResponseEntity.ok(conversationService.getConversation(conversationId));
    }

    @PostMapping("/{conversationId}/read")
    public ResponseEntity<Void> markConversationAsRead(
            @PathVariable Long conversationId) {
        conversationService.markConversationAsRead(conversationId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{conversationId}")
    public ResponseEntity<Void> deleteConversation(
            @PathVariable Long conversationId) {
        conversationService.deleteConversation(conversationId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread/count/{userId}")
    public ResponseEntity<Integer> getUnreadConversationCount(
            @PathVariable Long userId) {
        return ResponseEntity.ok(conversationService.getUnreadConversationCount(userId));
    }
} 