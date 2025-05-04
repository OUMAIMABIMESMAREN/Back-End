package com.oumaimabimesmaren.studentsystem.mapper;

import com.oumaimabimesmaren.studentsystem.dto.OrganizerResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Organizer;

public class OrganizerMapper {
    public static OrganizerResponseDTO toResponseDTO(Organizer organizer) {
        return new OrganizerResponseDTO(
                organizer.getId(),
                organizer.getF_name(),
                organizer.getL_name(),
                organizer.getEmail(),
                organizer.getVille(),
                organizer.getAddress(),
                organizer.getRating(),
                organizer.getStatus()
        );
    }
}
