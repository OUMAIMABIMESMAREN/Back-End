package com.oumaimabimesmaren.studentsystem.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
@Data
@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String lieu;

    @ManyToMany
    @JoinTable(
            name = "event_participants",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "participant_id")
    )
    private List<Participant> participants;

    @Column(name = "event_date", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date eventDate;

    private Double price;
    private int capacity;
    private String category;
    private String description;
    @ManyToOne
    @JoinColumn(name = "organizer_id", nullable = false)
    private Organizer organizer;

    @Column(name = "media_url")
    private String videoImageUrl;

    private String validationStatus = "PENDING"; // VALIDATED, REJECTED

    @ManyToOne
    @JoinColumn(name = "validated_by")
    private Admin validatedBy;

    private LocalDateTime validationDate;


    @ElementCollection
    private List<String> media = new ArrayList<>();

    // Add this method:
    public void addMedia(String mediaUrl) {
        this.media.add(mediaUrl);
    }
    private boolean validated;
    private String status;  // "ACTIVE", "CANCELLED", etc.
    private String cancellationDetails;
    private boolean isCancelled = false;
    private String cancellationReason;

}