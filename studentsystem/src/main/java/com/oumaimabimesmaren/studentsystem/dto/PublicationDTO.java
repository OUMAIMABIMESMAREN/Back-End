package com.oumaimabimesmaren.studentsystem.dto;

public class PublicationDTO {
    private Long organizerId;
    private Long eventId;
    private String content;

    // Getters and setters

    public Long getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Long organizerId) {
        this.organizerId = organizerId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
