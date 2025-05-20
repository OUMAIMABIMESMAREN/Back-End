package com.oumaimabimesmaren.studentsystem.dto;

import lombok.Data;

@Data
public class ParticipantResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String country;
    private String photo;
    private String newsletterFrequency;
    private String upcomingEvents;
}

