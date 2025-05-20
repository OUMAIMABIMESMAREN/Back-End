package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.dto.ApplyPromoDTO;
import com.oumaimabimesmaren.studentsystem.dto.TicketDTO;
import com.oumaimabimesmaren.studentsystem.dto.TicketResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Ticket;
import com.oumaimabimesmaren.studentsystem.service.TicketService;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired private TicketService ticketService;


    @PostMapping("/generate")
    public TicketResponseDTO generateTicket(@RequestBody TicketDTO ticketDTO) {
        TicketResponseDTO ticket = ticketService.generateTicket(
                ticketDTO.getReservationId(),
                ticketDTO.getType(),
                ticketDTO.getSeatNumber()
        );
        return new TicketResponseDTO(ticket);
    }

    @PostMapping("/{ticketId}/applyPromo")
    public TicketResponseDTO applyPromoPost(@RequestParam Long ticketId, @RequestBody ApplyPromoDTO dto) {
        return ticketService.applyPromoCode(ticketId, dto.getPromoCode());
    }

    @PostMapping("/{ticketId}/validate")
    public ResponseEntity<Map<String, String>> validateTicket(@PathVariable Long ticketId) {
        ticketService.validateTicket(ticketId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Ticket has been successfully validated");

        return ResponseEntity.ok(response);
    }


    @PostMapping("/{ticketId}/send")
    public void sendTicket(@PathVariable Long ticketId) {
        ticketService.sendTicketToEmail(ticketId);
    }

    @GetMapping("/reservation/{reservationId}")
    public List<TicketResponseDTO> getByReservation(@PathVariable Long reservationId) {
        return ticketService.getTicketsByReservation(reservationId);
    }

    @GetMapping("/participant/{participantId}")
    public List<TicketResponseDTO> getByParticipant(@PathVariable Long participantId) {
        return ticketService.getTicketsByParticipant(participantId);
    }

    @GetMapping("/event/{eventId}")
    public List<TicketResponseDTO> getByEvent(@PathVariable Long eventId) {
        return ticketService.getTicketsByEvent(eventId);
    }

    @PostMapping("/{ticketId}/payment")
    public String createPaymentIntent(@PathVariable Long ticketId) {
        try {
            return ticketService.createPaymentIntent(ticketId);
        } catch (StripeException e) {
            throw new RuntimeException("Payment processing error", e);
        }
    }
}