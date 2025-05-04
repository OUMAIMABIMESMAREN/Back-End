package com.oumaimabimesmaren.studentsystem.service.impl;

import com.oumaimabimesmaren.studentsystem.dto.ApplyPromoDTO;
import com.oumaimabimesmaren.studentsystem.model.*;
import com.oumaimabimesmaren.studentsystem.repository.*;
import com.oumaimabimesmaren.studentsystem.service.EmailService;
import com.oumaimabimesmaren.studentsystem.service.PaymentGatewayService;
import com.oumaimabimesmaren.studentsystem.service.QRCodeService;
import com.oumaimabimesmaren.studentsystem.service.TicketService;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.oumaimabimesmaren.studentsystem.dto.TicketResponseDTO;
import com.oumaimabimesmaren.studentsystem.mapper.TicketMapper;

@Service
public class TicketServiceImpl implements TicketService {

    @Autowired private TicketRepository ticketRepository;
    @Autowired private ReservationRepository reservationRepository;
    @Autowired private EmailService emailService;
    @Autowired private QRCodeService qrCodeService;
    @Autowired private QRCodeService qrService;
    @Autowired private PaymentGatewayService paymentService;
    @Autowired private PromoCodeRepository promoCodeRepository;

    @Override
    @Transactional
    public TicketResponseDTO generateTicket(Long reservationId, Ticket.TicketType type, String seatNumber) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        Ticket ticket = new Ticket();
        ticket.setReservation(reservation);
        ticket.setType(type);
        ticket.setSeatNumber(seatNumber);
        ticket.setOriginalPrice(reservation.getEvent().getPrice());

        try {
            String qrContent = String.format(
                    "Event:%s|Ticket:%s|Seat:%s|Participant:%s",
                    reservation.getEvent().getId(),
                    type,
                    seatNumber,
                    reservation.getParticipant().getId()
            );
            ticket.setQrCodeData(qrService.generateQRCodeImage(qrContent, 250, 250));
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR code", e);
        }

        return TicketMapper.toDTO(ticketRepository.save(ticket));
    }

    @Override
    @Transactional
    public TicketResponseDTO applyPromoCode(Long ticketId, PromoCode promo) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setPromoCode(promo);
        ticket.applyPromo(20.0);

        return TicketMapper.toDTO(ticketRepository.save(ticket));
    }

    @Override
    @Transactional
    public void validateTicket(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (!ticket.isValid()) {
            throw new IllegalStateException("Ticket is no longer valid");
        }

        ticket.setValid(false);
        ticketRepository.save(ticket);
    }

    @Override
    @Transactional
    public void sendTicketToEmail(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        String emailContent = String.format(
                "Your ticket for %s\n" +
                        "Type: %s\n" +
                        "Seat: %s\n" +
                        "Price: %.2f\n" +
                        "QR Code: %s",
                ticket.getReservation().getEvent().getTitle(),
                ticket.getType(),
                ticket.getSeatNumber(),
                ticket.getFinalPrice(),
                ticket.getQrCodeData()
        );

        emailService.sendEmail(
                ticket.getReservation().getParticipant().getEmail(),
                "Your Event Ticket",
                emailContent
        );
    }

    @Override
    public String createPaymentIntent(Long ticketId) throws StripeException {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        return paymentService.createPaymentIntent(
                ticket.getFinalPrice(),
                "usd",
                "Ticket for " + ticket.getReservation().getEvent().getTitle()
        );
    }

    @Override
    public List<TicketResponseDTO> getTicketsByReservation(Long reservationId) {
        return ticketRepository.findByReservationId(reservationId)
                .stream().map(TicketMapper::toDTO).toList();
    }

    @Override
    public List<TicketResponseDTO> getTicketsByParticipant(Long participantId) {
        return ticketRepository.findByReservationParticipantId(participantId)
                .stream().map(TicketMapper::toDTO).toList();
    }

    @Override
    public List<TicketResponseDTO> getTicketsByEvent(Long eventId) {
        return ticketRepository.findByReservationEventId(eventId)
                .stream().map(TicketMapper::toDTO).toList();
    }

    public PromoCode getAppliedPromoCode(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        return ticket.getPromoCode(); // assuming this field exists
    }

}
