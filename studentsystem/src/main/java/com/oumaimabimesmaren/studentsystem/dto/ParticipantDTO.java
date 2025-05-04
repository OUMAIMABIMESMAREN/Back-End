package com.oumaimabimesmaren.studentsystem.dto;

import com.oumaimabimesmaren.studentsystem.model.Participant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantDTO {
    private Long id;
    private String fullName;
    private String email;
    private String attendanceStatus; // e.g., "CONFIRMED", "CANCELLED"

}
