package com.oumaimabimesmaren.studentsystem.model;

import com.oumaimabimesmaren.studentsystem.added.model.Conversation;
import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date sentDate = new Date();

    private boolean isRead = false;

    // Methods
    public void markAsRead() {
        this.isRead = true;
    }

    // Getters and setters
    public Long getId() { return id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }

    public User getReceiver() { return receiver; }
    public void setReceiver(User receiver) { this.receiver = receiver; }

    public Date getSentDate() { return sentDate; }
    public void setSentDate(Date sentDate){this.sentDate=sentDate;}

    public boolean isRead() { return isRead; }

    public Conversation getConversation() { return conversation; }
    public void setConversation(Conversation conversation) { this.conversation = conversation; }
}
