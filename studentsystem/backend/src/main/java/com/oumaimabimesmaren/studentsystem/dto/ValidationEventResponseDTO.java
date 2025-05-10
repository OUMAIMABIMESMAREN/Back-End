package com.oumaimabimesmaren.studentsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ValidationEventResponseDTO {
    private Long eventId;
    private boolean isValidated;
    private String status;
    private String validationStatus;
    private LocalDateTime validationDate;
    private AdminResponseDTO  validatedByAdminName;
}
