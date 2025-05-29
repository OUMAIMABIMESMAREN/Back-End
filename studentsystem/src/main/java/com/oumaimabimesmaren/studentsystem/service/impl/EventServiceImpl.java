package com.oumaimabimesmaren.studentsystem.service.impl;

import com.oumaimabimesmaren.studentsystem.dto.EventDTO;
import com.oumaimabimesmaren.studentsystem.dto.EventResponseDTO;
import com.oumaimabimesmaren.studentsystem.dto.EventSearchDTO;
import com.oumaimabimesmaren.studentsystem.dto.OrganizerResponseDTO;
import com.oumaimabimesmaren.studentsystem.dto.ParticipantResponseDTO;
import com.oumaimabimesmaren.studentsystem.exception.ResourceNotFoundException;
import com.oumaimabimesmaren.studentsystem.mapper.EventMapper;
import com.oumaimabimesmaren.studentsystem.mapper.ParticipantMapper;
import com.oumaimabimesmaren.studentsystem.model.Event;
import com.oumaimabimesmaren.studentsystem.model.Organizer;
import com.oumaimabimesmaren.studentsystem.repository.EventRepository;
import com.oumaimabimesmaren.studentsystem.repository.OrganizerRepository;
import com.oumaimabimesmaren.studentsystem.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.stream.Collectors;

import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private OrganizerRepository organizerRepository;
    
    @Autowired
    private EventMapper eventMapper;
    
    @Autowired
    private ParticipantMapper participantMapper;
    @Override
    public List<EventResponseDTO> getUpcomingEventsForHomePage() {
        LocalDateTime now = LocalDateTime.now();
        List<Event> events = eventRepository.findByEventDateAfterAndStatusNot(now, "CANCELLED");
        return events.stream()
                .map(EventMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventResponseDTO> getUpcomingEvents() {
        LocalDateTime now = LocalDateTime.now();
        List<Event> events = eventRepository.findByEventDateAfterAndStatusNot(now, "CANCELLED");
        return events.stream()
                .map(EventMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EventResponseDTO getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return eventMapper.toResponseDTO(event);
    }

    @Override
    public List<ParticipantResponseDTO> getEventParticipants(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return event.getParticipants().stream()
                .map(participantMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EventResponseDTO addEvent(EventDTO eventDTO) {
        Event event = eventMapper.toEntity(eventDTO);
        if (eventDTO.getOrganizerId() != null) {
            Organizer organizer = organizerRepository.findById(eventDTO.getOrganizerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Organizer not found with id: " + eventDTO.getOrganizerId()));
            event.setOrganizer(organizer);
        }
        Event savedEvent = eventRepository.save(event);
        return eventMapper.toResponseDTO(savedEvent);
    }

    @Override
    public void addEventMedia(Long eventId, String mediaUrl) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        event.addMedia(mediaUrl);
        eventRepository.save(event);
    }

    @Override
    public void requestEventCancellation(Long eventId, String reason) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        event.setCancelled(true);
        event.setCancellationReason(reason);
        event.setStatus("CANCELLED");
        eventRepository.save(event);
    }

    @Override
    public List<EventResponseDTO> searchEvents(@Valid EventSearchDTO searchCriteria) {
        LocalDateTime fromDateTime = searchCriteria.getFromDate();
        LocalDateTime toDateTime = searchCriteria.getToDate(); // end of the day

        List<Event> events = eventRepository.findAdvanced(
                searchCriteria.getTitle(),
                searchCriteria.getCategory(),
                fromDateTime,
                toDateTime,
                searchCriteria.getMinPrice(),
                searchCriteria.getMaxPrice(),
                searchCriteria.getLocation()
        );

        return events.stream()
                .map(EventMapper::toResponseDTO)
                .collect(Collectors.toList());
    }


    @Override
    public List<EventResponseDTO> getEventsByOrganizer(Long organizerId) {
        List<Event> events = eventRepository.findByOrganizerId(organizerId);
        return events.stream()
                .map(EventMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EventResponseDTO updateEvent(Long eventId, EventDTO eventDTO) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        eventMapper.updateEntityFromDTO(eventDTO, event);

        if (eventDTO.getOrganizerId() != null) {
            Organizer organizer = organizerRepository.findById(eventDTO.getOrganizerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Organizer not found with id: " + eventDTO.getOrganizerId()));
            event.setOrganizer(organizer);
        }

        Event updatedEvent = eventRepository.save(event);
        return eventMapper.toResponseDTO(updatedEvent);
    }

    @Override
    public void deleteEvent(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event not found with id: " + eventId);
        }
        eventRepository.deleteById(eventId);
    }
}
