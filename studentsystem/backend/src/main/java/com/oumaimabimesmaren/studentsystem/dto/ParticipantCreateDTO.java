package com.oumaimabimesmaren.studentsystem.dto;

import lombok.Data;

@Data
public class ParticipantCreateDTO {
    private String f_name;
    private String l_name;
    private String birthDate;
    private String email;
    private String password;
    private String phone_num;
    private String ville;
    private String address;
    private String role;
    private String profilPic;
    private String attendanceStatus;
    private Long eventId;
}