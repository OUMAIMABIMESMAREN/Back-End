package com.oumaimabimesmaren.studentsystem.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class OrganizerDTO {

    @NotBlank(message = "First name is required")
    private String f_name;

    @NotBlank(message = "Last name is required")
    private String l_name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @Size(min = 6, message = "Password must be at least 6 characters")
    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Phone number is required")
    private String phone_num;

    private String idNumber; // Optional
    private String portfolioLink; // Optional
    private boolean acceptsContract;
}
