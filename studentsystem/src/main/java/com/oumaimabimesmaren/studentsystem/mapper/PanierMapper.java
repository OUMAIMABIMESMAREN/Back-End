package com.oumaimabimesmaren.studentsystem.mapper;

import com.oumaimabimesmaren.studentsystem.dto.PanierResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Panier;
import com.oumaimabimesmaren.studentsystem.model.Reservation;

import java.util.stream.Collectors;

public class PanierMapper {

    public static PanierResponseDTO toDTO(Panier panier) {
        PanierResponseDTO dto = new PanierResponseDTO();
        dto.setId(panier.getId());
        dto.setParticipantId(panier.getParticipant().getId());
        dto.setCreationDate(panier.getCreationDate());
        dto.setIsValidated(panier.getIsValidated());
        dto.setIsPaid(panier.getIsPaid());

        ReservationMapper reservationMapper;
        dto.setReservations(
                panier.getReservations()
                        .stream()
                        .map(ReservationMapper::toResponseDTO)
                        .collect(Collectors.toList())
        );
        return dto;
    }

}
