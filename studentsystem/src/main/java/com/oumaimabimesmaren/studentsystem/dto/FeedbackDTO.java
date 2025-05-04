package com.oumaimabimesmaren.studentsystem.dto;

public class FeedbackDTO {
    private Long participantId;
    private Long publicationId;
    private String content;

    // Getters and setters
    public Long getParticipantId() { return participantId; }
    public void setParticipantId(Long participantId) { this.participantId = participantId; }

    public Long getPublicationId() { return publicationId; }
    public void setPublicationId(Long publicationId) { this.publicationId = publicationId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
