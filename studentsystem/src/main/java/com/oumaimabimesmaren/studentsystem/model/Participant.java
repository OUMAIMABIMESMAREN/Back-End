package com.oumaimabimesmaren.studentsystem.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@DiscriminatorValue("PARTICIPANT")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE) // Shares table with User
public class Participant extends User {


    private String attendanceStatus;// e.g., "CONFIRMED", "CANCELLED", "PENDING"
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

}