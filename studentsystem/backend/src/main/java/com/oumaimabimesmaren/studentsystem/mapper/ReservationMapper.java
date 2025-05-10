package com.oumaimabimesmaren.studentsystem.mapper;

import com.oumaimabimesmaren.studentsystem.dto.ReservationResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Reservation;
import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {
    public static ReservationResponseDTO toResponseDTO(Reservation reservation) {
        ReservationResponseDTO dto = new ReservationResponseDTO();

        dto.setId(reservation.getId());
        dto.setParticipantId(reservation.getParticipant().getId());
        dto.setParticipantName(reservation.getParticipant().getF_name() + " " + reservation.getParticipant().getL_name());
        dto.setEventId(reservation.getEvent().getId());
        dto.setEventTitle(reservation.getEvent().getTitle());  // Assuming `getTitle()` method
        dto.setStatus(reservation.getStatus());
        dto.setPrice(reservation.getEvent().getPrice());


        return dto;
    }
    public static ReservationResponseDTO toDTO(Reservation reservation) {
        if (reservation == null) {
            return null;
        }

        return new ReservationResponseDTO(
                reservation.getId(),
                reservation.getParticipant().getId(),
                reservation.getParticipant().getF_name() + " " + reservation.getParticipant().getL_name(),
                reservation.getEvent().getId(),
                reservation.getEvent().getTitle(),
                reservation.getStatus(),
                reservation.getEvent().getPrice()
        );
    }
}

