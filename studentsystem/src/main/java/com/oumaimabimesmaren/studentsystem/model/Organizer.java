package com.oumaimabimesmaren.studentsystem.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@DiscriminatorValue("ORGANIZER")
public class Organizer extends User {

    @OneToMany(mappedBy = "organizer", cascade = CascadeType.ALL)
    private List<Event> events;
    @Column(name = "rating")
    private Double rating;
    private String status = "PENDING"; // APPROVED, REJECTED
    @ManyToOne
    @JoinColumn(name = "approved_by")
    private Admin approvedBy;
    private Boolean approved;



    // Default constructor (required by JPA)
    public Organizer() {}

}