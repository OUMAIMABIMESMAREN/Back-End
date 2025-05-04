package com.oumaimabimesmaren.studentsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String f_name;
    private String l_name;
    private String email;
    private String role;
}

