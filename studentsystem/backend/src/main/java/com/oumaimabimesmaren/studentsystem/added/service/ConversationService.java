package com.oumaimabimesmaren.studentsystem.added.service;

import com.oumaimabimesmaren.studentsystem.added.dto.ConversationResponseDTO;
import java.util.List;

public interface ConversationService {
    ConversationResponseDTO createConversation(Long participantId, Long organizerId);
    List<ConversationResponseDTO> getParticipantConversations(Long participantId);
    List<ConversationResponseDTO> getOrganizerConversations(Long organizerId);
    ConversationResponseDTO getConversation(Long conversationId);
    void markConversationAsRead(Long conversationId);
    void deleteConversation(Long conversationId);
    int getUnreadConversationCount(Long userId);
} 