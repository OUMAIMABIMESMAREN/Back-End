package com.oumaimabimesmaren.studentsystem.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
@Data
@Entity
@DiscriminatorValue("ADMIN")
public class Admin extends User {

    @OneToMany(mappedBy = "approvedBy")
    private List<Organizer> approvedOrganizers;

    @OneToMany(mappedBy = "validatedBy")
    private List<Event> validatedEvents;

    public Admin() {}
}
