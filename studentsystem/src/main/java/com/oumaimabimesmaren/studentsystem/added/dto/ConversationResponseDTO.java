package com.oumaimabimesmaren.studentsystem.added.dto;

import com.oumaimabimesmaren.studentsystem.dto.MessageResponseDTO;

import java.util.Date;
import java.util.List;

public class ConversationResponseDTO {
    private Long id;
    private String participantName;
    private String organizerName;
    private Date createdAt;
    private Date lastMessageDate;
    private boolean isActive;
    private List<MessageResponseDTO> messages;
    private int unreadCount;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getParticipantName() { return participantName; }
    public void setParticipantName(String participantName) { this.participantName = participantName; }

    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getLastMessageDate() { return lastMessageDate; }
    public void setLastMessageDate(Date lastMessageDate) { this.lastMessageDate = lastMessageDate; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public List<MessageResponseDTO> getMessages() { return messages; }
    public void setMessages(List<MessageResponseDTO> messages) { this.messages = messages; }

    public int getUnreadCount() { return unreadCount; }
    public void setUnreadCount(int unreadCount) { this.unreadCount = unreadCount; }
} 