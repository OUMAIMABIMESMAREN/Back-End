package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.dto.ApplyPromoDTO;
import com.oumaimabimesmaren.studentsystem.dto.TicketResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.PromoCode;
import com.oumaimabimesmaren.studentsystem.model.Ticket;
import com.stripe.exception.StripeException;

import java.util.List;

public interface TicketService {
    TicketResponseDTO generateTicket(Long reservationId, Ticket.TicketType type, String seatNumber);
    TicketResponseDTO applyPromoCode(Long ticketId, PromoCode dto);
    void validateTicket(Long ticketId);
    void sendTicketToEmail(Long ticketId);
    String createPaymentIntent(Long ticketId) throws StripeException;
    List<TicketResponseDTO> getTicketsByReservation(Long reservationId);
    List<TicketResponseDTO> getTicketsByParticipant(Long participantId);
    List<TicketResponseDTO> getTicketsByEvent(Long eventId);
    PromoCode getAppliedPromoCode(Long ticketId);

}
