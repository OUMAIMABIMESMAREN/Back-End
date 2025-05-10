package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.dto.*;
import com.oumaimabimesmaren.studentsystem.mapper.ParticipantMapper;
import com.oumaimabimesmaren.studentsystem.model.Event;
import com.oumaimabimesmaren.studentsystem.model.Organizer;
import com.oumaimabimesmaren.studentsystem.model.Participant;
import com.oumaimabimesmaren.studentsystem.service.EventService;
import com.oumaimabimesmaren.studentsystem.service.ParticipantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/participants")
public class ParticipantController {

    @Autowired
    private ParticipantService participantService;
    @Autowired
    private EventService eventService;
    @Autowired
    private ParticipantMapper mapper;

    public ParticipantController(ParticipantService participantService) {
        this.participantService = participantService;
    }

    @PostMapping("/search/organizers")
    public ResponseEntity<List<Organizer>> searchOrganizers(
            @Valid @RequestBody OrganizerFilters filters) {
        String query = filters.getOrganizationType(); // or wherever your "query" is coming from
        List<Organizer> organizers = participantService.searchOrganizers(query, filters);
        return ResponseEntity.ok(organizers);
    }
    @PostMapping("/search/events")
    public ResponseEntity<?> searchEvents(
            @Valid @RequestBody EventSearchDTO filters) {
        try {
            List<EventResponseDTO> events = eventService.searchEvents(filters);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error searching events: " + e.getMessage());
        }
    }
    @PostMapping("/create")
    public ParticipantDTO createParticipant(@RequestBody ParticipantCreateDTO participantCreateDTO) {
        return participantService.createParticipant(participantCreateDTO);
    }

    @GetMapping("/me")
    public ResponseEntity<ParticipantResponseDTO> getMyInfo(Authentication authentication) {
        String email = authentication.getName(); // assuming username = email
        Participant participant = participantService.findByEmail(email);
        ParticipantResponseDTO dto = mapper.toResponseDTO(participant);
        return ResponseEntity.ok(dto);
    }

}