package com.oumaimabimesmaren.studentsystem.dto;

import java.util.Date;

public class MessageResponseDTO {
    private Long id;
    private String content;
    private String senderName;
    private String receiverName;
    private Date sentDate;
    private boolean read;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }

    public Date getSentDate() { return sentDate; }
    public void setSentDate(Date sentDate) { this.sentDate = sentDate; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
}
