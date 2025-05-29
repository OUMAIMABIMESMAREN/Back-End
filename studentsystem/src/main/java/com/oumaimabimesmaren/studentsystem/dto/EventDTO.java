package com.oumaimabimesmaren.studentsystem.dto;

import com.oumaimabimesmaren.studentsystem.model.Organizer;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
public class EventDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Location is required")
    private String lieu; // "lieu" not "location" because that's your field name!

    @NotNull(message = "Event date is required")
    private LocalDateTime eventDate;

    private Double price;
    private Integer capacity;
    private String category;
    private String description;
    private String videoImageUrl;
    private String validationStatus; // optional, can stay null ("PENDING")
    private boolean validated;
    private String status; // "ACTIVE", "CANCELLED", etc.
    private String cancellationDetails;
    private boolean isCancelled;
    private String cancellationReason;

    private List<String> media; // List of media URLs
    private Long organizerId;
}
