package com.oumaimabimesmaren.studentsystem.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
@Data
@Entity
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketType type;

    private String seatNumber;
    @ManyToOne
    @JoinColumn(name = "promo_code_id")
    private PromoCode promoCode;

    private Double originalPrice;
    private Double finalPrice;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date issuedAt = new Date();

    private boolean isValid = true;
    @Lob
    @Column(name = "qr_code_data", columnDefinition = "LONGTEXT")
    private String qrCodeData;

    public enum TicketType {
        VIP, STANDARD, FREE
    }

    public void applyPromo(Double discountPercentage) {
        this.finalPrice = this.originalPrice * (1 - discountPercentage/100);
    }
    public void setOriginalPrice(Double originalPrice) {
        this.originalPrice = originalPrice;
        this.finalPrice = originalPrice;
    }
    public boolean isValid() { return isValid; }
    public void setValid(boolean valid) { isValid = valid; }

}