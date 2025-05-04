package com.oumaimabimesmaren.studentsystem.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
@Data
@Entity
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cancelled_by_admin")
    private Boolean cancelledByAdmin = false;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date reservationDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_id", nullable = false)
    private Participant participant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    private String cancellationReason;
    private String status; // PENDING, CONFIRMED, CANCELLED

    private Double originalPaymentAmount; // Useful for refund calculations

    public void cancel(String reason) {
        if (this.status.equals("CANCELLED")) {
            throw new IllegalStateException("Reservation already cancelled");
        }
        this.status = "CANCELLED";
        this.cancellationReason = reason;
    }
    public boolean isCancellable() {
        return new Date().before(this.cancellationDeadline) &&
                !this.status.equals("CANCELLED");
    }
    public Reservation() {
        this.reservationDate = new Date();
        this.status = "PENDING";
    }

    public Reservation(Participant participant, Event event) {
        this();
        this.participant = participant;
        this.event = event;
    }

    public enum CancellationPolicy {
        FREE_CANCELLATION,  // Full refund before deadline
        REFUNDABLE,         // Partial refund with penalty
        NON_REFUNDABLE      // No refund allowed
    }

    @Enumerated(EnumType.STRING)
    private CancellationPolicy cancellationPolicy;

    @Column(name = "cancellation_deadline")
    @Temporal(TemporalType.TIMESTAMP)
    private Date cancellationDeadline;

    private Double penaltyAmount;
    @Column(name = "refund_processed")
    private Boolean refundProcessed = false;


    // Method 1: Reserve
    public void reserve() {
        this.status = "PENDING";
        System.out.println("Reservation created for event: " + event.getTitle());
    }

    // Method 2: Modify reservation (change event)
    public void modifyReservation(Event newEvent) {
        this.event = newEvent;
        System.out.println("Reservation modified to event: " + newEvent.getTitle());
    }

    // Method 4: Confirm reservation
    public void confirm() {
        this.status = "CONFIRMED";
        System.out.println("Reservation confirmed. Notifying participant...");
        // Notification logic would be in service layer
    }


    @ManyToOne
    @JoinColumn(name = "panier_id")
    private Panier panier;

}
