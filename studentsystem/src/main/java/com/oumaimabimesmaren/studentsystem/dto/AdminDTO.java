package com.oumaimabimesmaren.studentsystem.dto;

import com.oumaimabimesmaren.studentsystem.model.Event;
import com.oumaimabimesmaren.studentsystem.model.Organizer;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDTO {
    private String f_name;
    private String l_name;
    private String email;
    private String password;
    private LocalDate birthDate;
    private String role;

    private String phone_num;


    private String ville;


    private String address;

    private String profilPic;

    private List<Long> approvedOrganizerIds;
    private List<Long> validatedEventIds;

}
