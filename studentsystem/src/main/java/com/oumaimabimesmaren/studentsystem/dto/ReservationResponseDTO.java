package com.oumaimabimesmaren.studentsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationResponseDTO {
    private Long id;
    private Long participantId;
    private String participantName;
    private Long eventId;
    private String eventTitle;
    private String status;
}
