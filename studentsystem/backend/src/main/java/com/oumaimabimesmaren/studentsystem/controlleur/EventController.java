package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.dto.ApiResponse;
import com.oumaimabimesmaren.studentsystem.dto.EventDTO;
import com.oumaimabimesmaren.studentsystem.dto.EventResponseDTO;
import com.oumaimabimesmaren.studentsystem.dto.EventSearchDTO;
import com.oumaimabimesmaren.studentsystem.model.Event;
import com.oumaimabimesmaren.studentsystem.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping("/upcoming")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTICIPANT', 'ORGANIZER')")
    public ResponseEntity<List<EventResponseDTO>> getUpcomingEvents() {
        List<EventResponseDTO> events = eventService.getUpcomingEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTICIPANT', 'ORGANIZER')")
    public ResponseEntity<EventResponseDTO> getEventById(@PathVariable Long id) {
        EventResponseDTO event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    @GetMapping("/{id}/participants")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public ResponseEntity<List<ParticipantResponseDTO>> getEventParticipants(@PathVariable Long id) {
        List<ParticipantResponseDTO> participants = eventService.getEventParticipants(id);
        return ResponseEntity.ok(participants);
    }

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<ApiResponse<EventResponseDTO>> createEvent(@Valid @RequestBody EventDTO eventDTO) {
        EventResponseDTO createdEvent = eventService.addEvent(eventDTO);
        ApiResponse<EventResponseDTO> response = new ApiResponse<>("success", "Event created successfully", createdEvent);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<EventResponseDTO> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventDTO eventDTO) {
        EventResponseDTO updatedEvent = eventService.updateEvent(id, eventDTO);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/media")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Void> addMedia(
            @PathVariable Long id,
            @RequestParam String mediaUrl) {
        eventService.addEventMedia(id, mediaUrl);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/cancel-request")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Void> requestCancellation(
            @PathVariable Long id,
            @RequestParam String reason) {
        eventService.requestEventCancellation(id, reason);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/organizer/{organizerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public ResponseEntity<List<EventResponseDTO>> getEventsByOrganizer(@PathVariable Long organizerId) {
        List<EventResponseDTO> events = eventService.getEventsByOrganizer(organizerId);
        return ResponseEntity.ok(events);
    }

    @PostMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTICIPANT', 'ORGANIZER')")
    public ResponseEntity<List<EventResponseDTO>> searchEvents(@Valid @RequestBody EventSearchDTO searchDTO) {
        List<EventResponseDTO> results = eventService.searchEvents(searchDTO);
        return ResponseEntity.ok(results);
    }
}