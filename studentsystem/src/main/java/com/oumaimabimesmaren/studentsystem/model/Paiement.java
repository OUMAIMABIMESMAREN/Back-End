package com.oumaimabimesmaren.studentsystem.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
@Data
@Entity
public class Paiement {
    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, REFUNDED
    }

    public enum PaymentMethod {
        CREDIT_CARD, PAYPAL, BANK_TRANSFER, MOBILE_MONEY
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "panier_id")
    private Panier panier;

    private Double amount;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    private String transactionId;

    @Column(name = "payment_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date paymentDate = new Date();

    @Enumerated(EnumType.STRING)
    private PaymentStatus status = PaymentStatus.PENDING;

    // Constructors
    public Paiement() {}

    public Paiement(Panier panier, PaymentMethod paymentMethod) {
        this.panier = panier;
        this.amount = panier.calculateTotal();
        this.paymentMethod = paymentMethod;
    }

}