package com.oumaimabimesmaren.studentsystem.dto;

import com.oumaimabimesmaren.studentsystem.model.Admin;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
public class EventResponseDTO {

    private Long id;
    private String title;
    private String lieu;
    private Date eventDate;
    private Double price;
    private Integer capacity;
    private String category;
    private String description;
    private String videoImageUrl;
    private LocalDateTime validationDate;
    private String validationStatus;
    private boolean validated;
    private Admin validatedBy;
    private String status;
    private String cancellationDetails;
    private boolean isCancelled;
    private String cancellationReason;
    private List<String> media;
    private OrganizerResponseDTO organizer;
}
