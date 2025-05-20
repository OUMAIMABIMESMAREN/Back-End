package com.oumaimabimesmaren.studentsystem.dto;

import lombok.Data;

import java.time.LocalDate;
@Data
public class PromoCodeResponseDTO {
    private Long id;
    private String code;
    private double discount;
    private LocalDate expirationDate;
    private boolean active;
}
