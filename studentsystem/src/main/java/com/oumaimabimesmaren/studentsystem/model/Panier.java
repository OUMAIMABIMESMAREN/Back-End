package com.oumaimabimesmaren.studentsystem.model;

import jakarta.persistence.*;
import java.util.*;

@Entity
public class Panier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_id", nullable = false)
    private Participant participant;

    @OneToMany(mappedBy = "panier", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations = new ArrayList<>();

    @OneToOne(mappedBy = "panier", cascade = CascadeType.ALL)
    private Paiement paiement;

    @Column(name = "creation_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date creationDate = new Date();

    @Column(name = "is_validated", nullable = false)
    private Boolean isValidated = false;

    // Constructors
    public Panier() {}

    public Panier(Participant participant) {
        this.participant = participant;
    }

    // Method 1: Add reservation(s) to panier
    public void addReservations(List<Reservation> newReservations) {
        for (Reservation reservation : newReservations) {
            reservation.setPanier(this);
            this.reservations.add(reservation);
        }
    }

    // Method 2: Validate panier (prepare for payment)
    public void validatePanier() {
        if (this.reservations.isEmpty()) {
            throw new IllegalStateException("Cannot validate empty panier");
        }
        this.isValidated = true;
    }

    // Method 3: Modify panier contents
    public void modifyPanier(List<Reservation> reservationsToAdd, List<Long> reservationIdsToRemove) {
        // Add new reservations
        if (reservationsToAdd != null && !reservationsToAdd.isEmpty()) {
            addReservations(reservationsToAdd);
        }

        // Remove reservations
        if (reservationIdsToRemove != null && !reservationIdsToRemove.isEmpty()) {
            reservations.removeIf(reservation ->
                    reservationIdsToRemove.contains(reservation.getId()));
        }
    }

    // Method 4: Cancel entire panier
    public void cancelPanier() {
        this.reservations.forEach(reservation -> {
            reservation.setStatus("CANCELLED");
            reservation.setPanier(null);
        });
        this.reservations.clear();
        this.isValidated = false;
    }

    // Method 5: Calculate total amount
    public Double calculateTotal() {
        return reservations.stream()
                .mapToDouble(res -> res.getEvent().getPrice())
                .sum();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public Participant getParticipant() { return participant; }
    public List<Reservation> getReservations() { return reservations; }
    public Paiement getPaiement() { return paiement; }
    public Date getCreationDate() { return creationDate; }
    public Boolean getIsValidated() { return isValidated; }

    public void setPaiement(Paiement paiement) {
        this.paiement = paiement;
        paiement.setPanier(this);
    }

    private Boolean isPaid = false;

    public Boolean getIsPaid() { return isPaid; }
    public void setIsPaid(Boolean isPaid) { this.isPaid = isPaid; }
}