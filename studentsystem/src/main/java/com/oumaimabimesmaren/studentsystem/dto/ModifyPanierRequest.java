package com.oumaimabimesmaren.studentsystem.dto;

import com.oumaimabimesmaren.studentsystem.model.Reservation;
import java.util.List;

public class ModifyPanierRequest {
    private List<Reservation> toAdd;
    private List<Long> toRemove;

    // Getters and setters
    public List<Reservation> getToAdd() {
        return toAdd;
    }

    public void setToAdd(List<Reservation> toAdd) {
        this.toAdd = toAdd;
    }

    public List<Long> getToRemove() {
        return toRemove;
    }

    public void setToRemove(List<Long> toRemove) {
        this.toRemove = toRemove;
    }
}
