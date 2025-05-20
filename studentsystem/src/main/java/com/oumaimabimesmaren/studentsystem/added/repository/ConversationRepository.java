package com.oumaimabimesmaren.studentsystem.added.repository;

import com.oumaimabimesmaren.studentsystem.added.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    
    List<Conversation> findByParticipantId(Long participantId);
    
    List<Conversation> findByOrganizerId(Long organizerId);
    
    @Query("SELECT COUNT(c) FROM Conversation c " +
           "JOIN c.messages m " +
           "WHERE (c.participant.id = :userId OR c.organizer.id = :userId) " +
           "AND m.isRead = false")
    int countUnreadConversations(Long userId);
} 