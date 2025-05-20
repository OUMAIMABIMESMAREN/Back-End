package com.oumaimabimesmaren.studentsystem.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ReservationDTO {
    private Long eventId;
    private Long participantId;
    private String status;
    private Double originalPaymentAmount;
    private Date cancellationDeadline;
    private String cancellationPolicy; // Enum as String
    private Double penaltyAmount;
}
