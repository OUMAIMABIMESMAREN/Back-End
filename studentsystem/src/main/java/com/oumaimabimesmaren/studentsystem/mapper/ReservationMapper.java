package com.oumaimabimesmaren.studentsystem.mapper;

import com.oumaimabimesmaren.studentsystem.dto.EventDTO;
import com.oumaimabimesmaren.studentsystem.dto.ReservationResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Event;
import com.oumaimabimesmaren.studentsystem.model.Reservation;
import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {
    public static ReservationResponseDTO toResponseDTO(Reservation reservation) {
        ReservationResponseDTO dto = new ReservationResponseDTO();

        dto.setId(reservation.getId());
        dto.setParticipantId(reservation.getParticipant().getId());
        dto.setParticipantName(reservation.getParticipant().getF_name() + " " + reservation.getParticipant().getL_name());
        dto.setEvent(mapEventToDTO(reservation.getEvent()));
        dto.setStatus(reservation.getStatus());
        dto.setPrice(reservation.getEvent().getPrice());

        return dto;
    }

    private static EventDTO mapEventToDTO(Event event) {
        EventDTO eventDTO = new EventDTO();
        eventDTO.setTitle(event.getTitle());
        eventDTO.setLieu(event.getLieu());
        eventDTO.setEventDate(event.getEventDate());
        eventDTO.setPrice(event.getPrice());
        eventDTO.setCapacity(event.getCapacity());
        eventDTO.setCategory(event.getCategory());
        eventDTO.setDescription(event.getDescription());
        eventDTO.setVideoImageUrl(event.getVideoImageUrl());
        eventDTO.setValidationStatus(event.getValidationStatus());
        eventDTO.setValidated(event.isValidated());
        eventDTO.setStatus(event.getStatus());
        eventDTO.setCancellationDetails(event.getCancellationDetails());
        eventDTO.setCancelled(event.isCancelled());
        eventDTO.setCancellationReason(event.getCancellationReason());
        eventDTO.setMedia(event.getMedia());
        eventDTO.setOrganizerId(event.getOrganizer().getId());
        
        return eventDTO;
    }

    public static ReservationResponseDTO toDTO(Reservation reservation) {
        if (reservation == null) {
            return null;
        }

        return new ReservationResponseDTO(
                reservation.getId(),
                reservation.getParticipant().getId(),
                reservation.getParticipant().getF_name() + " " + reservation.getParticipant().getL_name(),
                EventMapper.toDTO(reservation.getEvent()), // ✅ Proper EventDTO
                reservation.getStatus(),
                reservation.getEvent().getPrice()
        );

    }
}

