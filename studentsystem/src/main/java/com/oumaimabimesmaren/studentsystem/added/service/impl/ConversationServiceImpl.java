package com.oumaimabimesmaren.studentsystem.added.service.impl;

import com.oumaimabimesmaren.studentsystem.added.dto.ConversationResponseDTO;
import com.oumaimabimesmaren.studentsystem.added.model.Conversation;
import com.oumaimabimesmaren.studentsystem.model.Message;
import com.oumaimabimesmaren.studentsystem.added.service.ConversationService;
import com.oumaimabimesmaren.studentsystem.model.User;
import com.oumaimabimesmaren.studentsystem.repository.UserRepository;
import com.oumaimabimesmaren.studentsystem.repository.MessageRepository;
import com.oumaimabimesmaren.studentsystem.added.repository.ConversationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConversationServiceImpl implements ConversationService {

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Override
    @Transactional
    public ConversationResponseDTO createConversation(Long participantId, Long organizerId) {
        User participant = userRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Participant not found"));
        User organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> new RuntimeException("Organizer not found"));

        Conversation conversation = new Conversation();
        conversation.setParticipant(participant);
        conversation.setOrganizer(organizer);
        conversation.setActive(true);

        return convertToDTO(conversationRepository.save(conversation));
    }

    @Override
    public List<ConversationResponseDTO> getParticipantConversations(Long participantId) {
        return conversationRepository.findByParticipantId(participantId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ConversationResponseDTO> getOrganizerConversations(Long organizerId) {
        return conversationRepository.findByOrganizerId(organizerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ConversationResponseDTO getConversation(Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        return convertToDTO(conversation);
    }

    @Override
    @Transactional
    public void markConversationAsRead(Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        
        List<Message> messages = messageRepository.findByConversationId(conversationId);
        messages.forEach(Message::markAsRead);
        messageRepository.saveAll(messages);
    }

    @Override
    @Transactional
    public void deleteConversation(Long conversationId) {
        conversationRepository.deleteById(conversationId);
    }

    @Override
    public int getUnreadConversationCount(Long userId) {
        return conversationRepository.countUnreadConversations(userId);
    }

    private ConversationResponseDTO convertToDTO(Conversation conversation) {
        ConversationResponseDTO dto = new ConversationResponseDTO();
        dto.setId(conversation.getId());
        dto.setParticipantName(conversation.getParticipant().getF_name() + " " + conversation.getParticipant().getL_name());
        dto.setOrganizerName(conversation.getOrganizer().getF_name() + " " + conversation.getOrganizer().getL_name());
        dto.setCreatedAt(conversation.getCreatedAt());
        dto.setLastMessageDate(conversation.getLastMessageDate());
        dto.setActive(conversation.isActive());
        
        // Set unread count
        dto.setUnreadCount(messageRepository.countUnreadMessages(conversation.getId()));
        
        return dto;
    }
} 