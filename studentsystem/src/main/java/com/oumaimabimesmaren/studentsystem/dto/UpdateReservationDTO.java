package com.oumaimabimesmaren.studentsystem.dto;

import lombok.Data;

@Data
public class UpdateReservationDTO {
    private Long newEventId;   // Used to update the event
    private String status;     // E.g., "CANCELLED", "CONFIRMED"
    private Integer quantity;  // Number of tickets
}
