package com.oumaimabimesmaren.studentsystem.dto;

import lombok.Data;

@Data
public class AdminResponseDTO {
    private Long id;
    private String f_name;
    private String l_name;
    private String email;

    // Constructors
    public AdminResponseDTO() {}

    public AdminResponseDTO(Long id, String f_name, String l_name, String email) {
        this.id = id;
        this.f_name = f_name;
        this.l_name = l_name;
        this.email = email;
    }
}
