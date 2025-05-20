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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

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

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("All")
    public ResponseEntity<List<ParticipantResponseDTO>> getAllParticipants() {
        try {
            List<ParticipantResponseDTO> participants = participantService.getAllParticipants();
            return ResponseEntity.ok(participants);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('PARTICIPANT')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getParticipantById(@PathVariable Long id) {
        try {
            ParticipantResponseDTO participant = participantService.getParticipantById(id);
            return ResponseEntity.ok(participant);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Participant not found: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('PARTICIPANT')")
    @GetMapping("/profile")
    public ResponseEntity<?> getMyInfo(Authentication authentication) {
        System.out.println("Authenticated user: " + authentication.getName());
        System.out.println("Authorities: " + authentication.getAuthorities());
        try {
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User not authenticated");
            }

            String email = authentication.getName();
            Participant participant = participantService.findByEmail(email);
            
            if (participant == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Participant not found");
            }

            ParticipantResponseDTO dto = mapper.toResponseDTO(participant);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving participant information: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('PARTICIPANT')")
    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @RequestBody ParticipantUpdateDTO updateDTO) {
        try {
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User not authenticated");
            }

            String email = authentication.getName();
            ParticipantResponseDTO updated = participantService.updateProfile(email, updateDTO);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating profile: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('PARTICIPANT')")
    @PutMapping("/me/newsletter")
    public ResponseEntity<?> updateNewsletterFrequency(
            Authentication authentication,
            @RequestBody NewsletterUpdateDTO updateDTO) {
        try {
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User not authenticated");
            }

            String email = authentication.getName();
            ParticipantResponseDTO updated = participantService.updateNewsletterFrequency(email, updateDTO.getFrequency());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating newsletter preferences: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('PARTICIPANT')")
    @PostMapping("/search/organizers")
    public ResponseEntity<List<Organizer>> searchOrganizers(
            @Valid @RequestBody OrganizerFilters filters) {
        String query = filters.getOrganizationType();
        List<Organizer> organizers = participantService.searchOrganizers(query, filters);
        return ResponseEntity.ok(organizers);
    }

    @PreAuthorize("hasRole('PARTICIPANT')")
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

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ParticipantDTO createParticipant(@RequestBody ParticipantCreateDTO participantCreateDTO) {
        return participantService.createParticipant(participantCreateDTO);
    }

    @GetMapping("/test-auth")
    public ResponseEntity<?> test(Authentication authentication) {
        return ResponseEntity.ok("Hello " + authentication.getName() + ", roles: " + authentication.getAuthorities());
    }

    @PreAuthorize("hasRole('PARTICIPANT')")
@GetMapping("/getMyId")
public ResponseEntity<?> getMyParticipantId(Authentication authentication) {
    try {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("User not authenticated");
        }

        String email = authentication.getName();
        Participant participant = participantService.findByEmail(email);

        if (participant == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Participant not found");
        }

        // Return only the ID or wrap it in an object
        return ResponseEntity.ok(Map.of("id", participant.getId()));

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Error retrieving participant ID: " + e.getMessage());
    }
}

}