package com.oumaimabimesmaren.studentsystem.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RemboursementRequestDTO {
    private Long participantId;
    private Long eventId;
    private Double amount;
    private String status;
    private LocalDateTime requestDate;
}
