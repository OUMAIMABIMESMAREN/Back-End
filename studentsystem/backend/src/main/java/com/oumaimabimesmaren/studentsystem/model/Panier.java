package com.oumaimabimesmaren.studentsystem.model;

import com.oumaimabimesmaren.studentsystem.dto.ReservationResponseDTO;
import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Panier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Participant participant;

    @OneToMany(mappedBy = "panier", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations = new ArrayList<>();

    @OneToOne(mappedBy = "panier", cascade = CascadeType.ALL)
    private Paiement paiement;

    @Temporal(TemporalType.TIMESTAMP)
    private Date creationDate = new Date();

    private Boolean isValidated = false;

    private Boolean isPaid = false;

    public Panier(Participant participant) {
        this.participant = participant;
    }

    public void addReservations(List<Reservation> newReservations) {
        for (Reservation reservation : newReservations) {
            reservation.setId(this.getId());
            this.reservations.add(reservation);
        }
    }

    public void validatePanier() {
        if (this.reservations.isEmpty()) {
            throw new IllegalStateException("Cannot validate empty panier");
        }
        this.isValidated = true;
    }

    public void modifyPanier(List<Reservation> toAdd, List<Reservation> toRemove) {
        if (toAdd != null) {
            reservations.addAll(toAdd);
        }
        if (toRemove != null) {
            reservations.removeAll(toRemove);
        }
    }


    public void cancelPanier() {
        this.reservations.forEach(reservation -> {
            reservation.setStatus("CANCELLED");
            reservation.setId(null);
        });
        this.reservations.clear();
        this.isValidated = false;
    }


    public Double calculateTotal() {
        return reservations.stream()
                .mapToDouble(res -> res.getEvent().getPrice())
                .sum();
    }
}
