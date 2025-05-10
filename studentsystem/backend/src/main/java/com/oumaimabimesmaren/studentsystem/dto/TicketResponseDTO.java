package com.oumaimabimesmaren.studentsystem.dto;

import com.oumaimabimesmaren.studentsystem.model.PromoCode;
import com.oumaimabimesmaren.studentsystem.model.Ticket;
import com.oumaimabimesmaren.studentsystem.model.Ticket.TicketType;
import lombok.Data;

import java.util.Date;
@Data
public class TicketResponseDTO {
    private Long id;
    private TicketType type;
    private String seatNumber;
    private PromoCode promoCode;
    private Double originalPrice;
    private Double finalPrice;
    private Date issuedAt;
    private boolean isValid;
    private String qrCodeData;
    private Long reservationId;

    public TicketResponseDTO(){};


    public TicketResponseDTO(TicketResponseDTO ticket) {
        this.id = ticket.getId();
        this.type = TicketType.valueOf(ticket.getType().name());
        this.seatNumber = ticket.getSeatNumber();
        this.promoCode = ticket.getPromoCode();
        this.originalPrice = ticket.getOriginalPrice();
        this.finalPrice = ticket.getFinalPrice();
        this.issuedAt = ticket.getIssuedAt();
        this.isValid = ticket.isValid();
        this.qrCodeData = ticket.getQrCodeData();
    }

    public TicketResponseDTO(Long id, TicketType type, String seatNumber, PromoCode promoCode,
                             Double originalPrice, Double finalPrice, Date issuedAt,
                             boolean isValid, String qrCodeData) {
        this.id = id;
        this.type = type;
        this.seatNumber = seatNumber;
        this.promoCode = promoCode;
        this.originalPrice = originalPrice;
        this.finalPrice = finalPrice;
        this.issuedAt = issuedAt;
        this.isValid = isValid;
        this.qrCodeData = qrCodeData;
    }

    public boolean isValid() {
        return isValid;
    }

    public void setValid(boolean valid) {
        isValid = valid;
    }
}
