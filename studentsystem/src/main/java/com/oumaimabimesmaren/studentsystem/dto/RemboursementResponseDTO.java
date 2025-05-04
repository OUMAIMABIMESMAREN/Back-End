package com.oumaimabimesmaren.studentsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@AllArgsConstructor
@Data
@NoArgsConstructor
public class RemboursementResponseDTO {
    private Long id;
    private Long participantId;
    private String participantName;
    private Long eventId;
    private String eventTitle;
    private Double amount;
    private String status;
    private LocalDateTime requestDate;
}
