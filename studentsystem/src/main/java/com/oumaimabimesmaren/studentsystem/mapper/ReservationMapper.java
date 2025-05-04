package com.oumaimabimesmaren.studentsystem.mapper;

import com.oumaimabimesmaren.studentsystem.dto.ReservationResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Reservation;
import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {
    public ReservationResponseDTO toResponseDTO(Reservation reservation) {
        return new ReservationResponseDTO(
                reservation.getId(),
                reservation.getParticipant().getId(),
                reservation.getParticipant().getF_name() + " " + reservation.getParticipant().getL_name(),
                reservation.getEvent().getId(),
                reservation.getEvent().getTitle(),
                reservation.getStatus()
        );
    }
}

