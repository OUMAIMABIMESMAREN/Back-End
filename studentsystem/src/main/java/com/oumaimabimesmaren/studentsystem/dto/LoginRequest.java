package com.oumaimabimesmaren.studentsystem.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}