package com.oumaimabimesmaren.studentsystem.added.model;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_id", nullable = false)
    private User participant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL)
    private List<Message> messages;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date createdAt = new Date();

    @Temporal(TemporalType.TIMESTAMP)
    private Date lastMessageDate;

    private boolean isActive = true;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getParticipant() { return participant; }
    public void setParticipant(User participant) { this.participant = participant; }

    public User getOrganizer() { return organizer; }
    public void setOrganizer(User organizer) { this.organizer = organizer; }

    public List<Message> getMessages() { return messages; }
    public void setMessages(List<Message> messages) { this.messages = messages; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getLastMessageDate() { return lastMessageDate; }
    public void setLastMessageDate(Date lastMessageDate) { this.lastMessageDate = lastMessageDate; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
} 