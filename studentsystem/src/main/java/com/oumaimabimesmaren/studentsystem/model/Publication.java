package com.oumaimabimesmaren.studentsystem.model;

import jakarta.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Publication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private Organizer organizer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    private Date publicationDate = new Date();

    private int likeCount = 0;

    @OneToMany(mappedBy = "publication", cascade = CascadeType.ALL)
    private Set<Feedback> feedbacks = new HashSet<>();

    // Methods
    public void incrementLikes() {
        this.likeCount++;
    }

    public void decrementLikes() {
        if (this.likeCount > 0) {
            this.likeCount--;
        }
    }

    // Getters/Setters
    public Long getId() { return id; }
    public Organizer getOrganizer() { return organizer; }
    public void setOrganizer(Organizer organizer) { this.organizer = organizer; }
    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Date getPublicationDate() { return publicationDate; }
    public int getLikeCount() { return likeCount; }
    public Set<Feedback> getFeedbacks() { return feedbacks; }
}