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
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<EventResponseDTO>> addEvent(@Valid @RequestBody EventDTO eventDTO) {
        EventResponseDTO createdEvent = eventService.addEvent(eventDTO);
        ApiResponse<EventResponseDTO> response = new ApiResponse<>("success", "Event created successfully", createdEvent);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/media")
    public void addMedia(@PathVariable Long id, @RequestParam String mediaUrl) {
        eventService.addEventMedia(id, mediaUrl);
    }

    @PostMapping("/{id}/cancel-request")
    public void requestCancellation(@PathVariable Long id, @RequestParam String reason) {
        eventService.requestEventCancellation(id, reason);
    }

    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<List<EventResponseDTO>> getEventsByOrganizer(@PathVariable Long organizerId) {
        List<EventResponseDTO> events = eventService.getEventsByOrganizer(organizerId);
        return ResponseEntity.ok(events);
    }

    @PostMapping("/search")
    public ResponseEntity<List<EventResponseDTO>> searchEvents(@RequestBody @Valid EventSearchDTO searchDTO) {
        List<EventResponseDTO> results = eventService.searchEvents(searchDTO);
        return ResponseEntity.ok(results);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<EventResponseDTO>  updateEvent(
            @PathVariable("id") Long eventId,
            @RequestBody EventDTO eventDetails){
        EventResponseDTO updatedEvent = eventService.updateEvent(eventId, eventDetails);
        return ResponseEntity.ok(updatedEvent);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable("id") Long eventId){
        eventService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();

    }


}