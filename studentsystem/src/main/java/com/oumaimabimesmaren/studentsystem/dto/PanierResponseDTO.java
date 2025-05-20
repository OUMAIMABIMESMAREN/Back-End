package com.oumaimabimesmaren.studentsystem.dto;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class PanierResponseDTO {
    private Long id;
    private Long participantId;
    private Date creationDate;
    private Boolean isValidated;
    private Boolean isPaid;
    private List<ReservationResponseDTO> reservations;
}
