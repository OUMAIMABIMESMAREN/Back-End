package com.oumaimabimesmaren.studentsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrganizerResponseDTO {
    private Long id;
    private String fName;
    private String lName;
    private String email;
    private String ville;
    private String address;
    private Double rating;
    private String status;

}
