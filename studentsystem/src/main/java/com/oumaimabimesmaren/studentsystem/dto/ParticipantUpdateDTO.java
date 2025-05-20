package com.oumaimabimesmaren.studentsystem.dto;

import lombok.Data;

@Data
public class ParticipantUpdateDTO {
    private String f_name;
    private String l_name;
    private String phone_num;
    private String address;
    // Add more fields if your Participant entity has them and they should be editable
}
