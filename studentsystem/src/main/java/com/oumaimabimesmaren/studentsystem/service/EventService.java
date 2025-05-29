package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.dto.EventDTO;
import com.oumaimabimesmaren.studentsystem.dto.EventResponseDTO;
import com.oumaimabimesmaren.studentsystem.dto.EventSearchDTO;
import com.oumaimabimesmaren.studentsystem.dto.ParticipantResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Event;

import java.util.List;

public interface EventService {
    List<EventResponseDTO> getUpcomingEvents();
    List<EventResponseDTO> getUpcomingEventsForHomePage();
    EventResponseDTO getEventById(Long id);
    List<ParticipantResponseDTO> getEventParticipants(Long id);
    EventResponseDTO addEvent(EventDTO eventDTO);
    EventResponseDTO updateEvent(Long eventId, EventDTO eventDTO);
    void deleteEvent(Long eventId);
    void addEventMedia(Long eventId, String mediaUrl);
    void requestEventCancellation(Long eventId, String reason);
    List<EventResponseDTO> getEventsByOrganizer(Long organizerId);
    List<EventResponseDTO> searchEvents(EventSearchDTO searchCriteria);
}