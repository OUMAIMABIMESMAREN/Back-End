package com.oumaimabimesmaren.studentsystem.dto;

import com.oumaimabimesmaren.studentsystem.model.Ticket.TicketType;
import lombok.Data;

@Data
public class TicketDTO {
    private Long reservationId;
    private TicketType type;
    private String seatNumber;
}
