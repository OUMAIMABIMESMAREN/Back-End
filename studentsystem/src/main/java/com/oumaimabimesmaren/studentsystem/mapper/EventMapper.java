package com.oumaimabimesmaren.studentsystem.mapper;

import com.oumaimabimesmaren.studentsystem.dto.AdminResponseDTO;
import com.oumaimabimesmaren.studentsystem.dto.EventDTO;
import com.oumaimabimesmaren.studentsystem.dto.EventResponseDTO;
import com.oumaimabimesmaren.studentsystem.dto.OrganizerResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Admin;
import com.oumaimabimesmaren.studentsystem.model.Event;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class EventMapper {

    public Event toEntity(EventDTO eventDTO) {
        if (eventDTO == null) {
            return null;
        }
        Event event = new Event();
        event.setTitle(eventDTO.getTitle());
        event.setLieu(eventDTO.getLieu());
        event.setEventDate(eventDTO.getEventDate());
        event.setPrice(eventDTO.getPrice());
        event.setCapacity(eventDTO.getCapacity());
        event.setCategory(eventDTO.getCategory());
        event.setDescription(eventDTO.getDescription());
        event.setVideoImageUrl(eventDTO.getVideoImageUrl());
        event.setValidationStatus("PENDING");
        event.setValidated(false);
        event.setStatus("ACTIVE");
        event.setCancelled(false);
        event.setMedia(eventDTO.getMedia());
        return event;
    }

    public void updateEntityFromDTO(EventDTO eventDTO, Event event) {
        if (eventDTO == null || event == null) {
            return;
        }
        if (eventDTO.getTitle() != null) event.setTitle(eventDTO.getTitle());
        if (eventDTO.getLieu() != null) event.setLieu(eventDTO.getLieu());
        if (eventDTO.getEventDate() != null) event.setEventDate(eventDTO.getEventDate());
        if (eventDTO.getPrice() != null) event.setPrice(eventDTO.getPrice());
        if (eventDTO.getCapacity() != null) event.setCapacity(eventDTO.getCapacity());
        if (eventDTO.getCategory() != null) event.setCategory(eventDTO.getCategory());
        if (eventDTO.getDescription() != null) event.setDescription(eventDTO.getDescription());
        if (eventDTO.getVideoImageUrl() != null) event.setVideoImageUrl(eventDTO.getVideoImageUrl());
        if (eventDTO.getValidationStatus() != null) event.setValidationStatus(eventDTO.getValidationStatus());
        event.setValidated(eventDTO.isValidated());
        if (eventDTO.getStatus() != null) event.setStatus(eventDTO.getStatus());
        if (eventDTO.getCancellationDetails() != null) event.setCancellationDetails(eventDTO.getCancellationDetails());
        event.setCancelled(eventDTO.isCancelled());
        if (eventDTO.getCancellationReason() != null) event.setCancellationReason(eventDTO.getCancellationReason());
        if (eventDTO.getMedia() != null) event.setMedia(eventDTO.getMedia());
    }

    public static EventResponseDTO toResponseDTO(Event event) {
        List<String> mediaUrls = event.getMedia() != null ? event.getMedia() : List.of();

        OrganizerResponseDTO organizerDTO = event.getOrganizer() != null
                ? OrganizerMapper.toResponseDTO(event.getOrganizer())
                : null;

        AdminResponseDTO adminDTO = null;
        if (event.getValidatedBy() != null) {
            Admin admin = event.getValidatedBy();
            adminDTO = new AdminResponseDTO(
                    admin.getId(),
                    admin.getF_name(),
                    admin.getL_name(),
                    admin.getEmail()
            );
        }

        return new EventResponseDTO(
                event.getId(),
                event.getTitle(),
                event.getLieu(),
                event.getEventDate(),
                event.getPrice(),
                event.getCapacity(),
                event.getCategory(),
                event.getDescription(),
                event.getVideoImageUrl(),
                event.getValidationDate(),
                event.getValidationStatus(),
                event.isValidated(),
                adminDTO,  // ✅ Use the converted DTO here
                event.getStatus(),
                event.getCancellationDetails(),
                event.isCancelled(),
                event.getCancellationReason(),
                mediaUrls,
                organizerDTO
        );
    }
    public static EventDTO toDTO(Event event) {
        if (event == null) {
            return null;
        }

        EventDTO dto = new EventDTO();
        dto.setTitle(event.getTitle());
        dto.setLieu(event.getLieu());
        dto.setEventDate(event.getEventDate());
        dto.setPrice(event.getPrice());
        dto.setCapacity(event.getCapacity());
        dto.setCategory(event.getCategory());
        dto.setDescription(event.getDescription());
        dto.setVideoImageUrl(event.getVideoImageUrl());
        dto.setValidationStatus(event.getValidationStatus());
        dto.setValidated(event.isValidated());
        dto.setStatus(event.getStatus());
        dto.setCancellationDetails(event.getCancellationDetails());
        dto.setCancelled(event.isCancelled());
        dto.setCancellationReason(event.getCancellationReason());
        dto.setMedia(event.getMedia());
        dto.setOrganizerId(event.getOrganizer() != null ? event.getOrganizer().getId() : null);

        return dto;
    }

}
