// TicketMapper.java
package com.oumaimabimesmaren.studentsystem.mapper;

import com.oumaimabimesmaren.studentsystem.dto.TicketResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Ticket;

public class TicketMapper {
    public static TicketResponseDTO toDTO(Ticket ticket) {
        TicketResponseDTO dto = new TicketResponseDTO();
        dto.setId(ticket.getId());
        dto.setSeatNumber(ticket.getSeatNumber());
        dto.setType(ticket.getType());
        dto.setOriginalPrice(ticket.getOriginalPrice());
        dto.setFinalPrice(ticket.getFinalPrice());
        dto.setPromoCode(ticket.getPromoCode());
        dto.setQrCodeData(ticket.getQrCodeData());
        dto.setValid(ticket.isValid());
        dto.setReservationId(ticket.getReservation().getId());
        return dto;
    }
}
