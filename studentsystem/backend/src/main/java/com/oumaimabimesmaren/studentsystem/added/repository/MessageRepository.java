package com.oumaimabimesmaren.studentsystem.added.repository;

import com.oumaimabimesmaren.studentsystem.added.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    List<Message> findByConversationId(Long conversationId);
    
    @Query("SELECT COUNT(m) FROM Message m " +
           "WHERE m.conversation.id = :conversationId " +
           "AND m.isRead = false")
    int countUnreadMessages(Long conversationId);
    
    List<Message> findByConversationIdOrderByCreatedAtDesc(Long conversationId);
} 