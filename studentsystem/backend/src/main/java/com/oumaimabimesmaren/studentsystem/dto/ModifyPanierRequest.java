package com.oumaimabimesmaren.studentsystem.dto;

import com.oumaimabimesmaren.studentsystem.model.Reservation;
import lombok.Data;

import java.util.List;

@Data
public class ModifyPanierRequest {
    private List<Long> toAdd;
    private List<Long> toRemove;
}
