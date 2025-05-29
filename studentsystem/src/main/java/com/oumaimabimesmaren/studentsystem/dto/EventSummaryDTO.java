package com.oumaimabimesmaren.studentsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
public class EventSummaryDTO {
    private Long id;
    private String title;
    private LocalDateTime eventDate;
    private String location;
    private double price;
}
