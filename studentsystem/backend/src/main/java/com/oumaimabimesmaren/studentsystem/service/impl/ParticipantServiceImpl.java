package com.oumaimabimesmaren.studentsystem.service.impl;

import com.oumaimabimesmaren.studentsystem.dto.EventSearchDTO;
import com.oumaimabimesmaren.studentsystem.dto.OrganizerFilters;
import com.oumaimabimesmaren.studentsystem.dto.ParticipantCreateDTO;
import com.oumaimabimesmaren.studentsystem.dto.ParticipantDTO;
import com.oumaimabimesmaren.studentsystem.mapper.ParticipantMapper;
import com.oumaimabimesmaren.studentsystem.model.Event;
import com.oumaimabimesmaren.studentsystem.model.Organizer;
import com.oumaimabimesmaren.studentsystem.model.Participant;
import com.oumaimabimesmaren.studentsystem.repository.EventRepository;
import com.oumaimabimesmaren.studentsystem.repository.OrganizerRepository;
import com.oumaimabimesmaren.studentsystem.repository.ParticipantRepository;
import com.oumaimabimesmaren.studentsystem.service.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ParticipantServiceImpl implements ParticipantService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private OrganizerRepository organizerRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Override
    public List<Event> searchEvents(EventSearchDTO filters) {
        return eventRepository.findByTitleContainingAndLieuAndEventDateBetween(
                filters.getQuery(),   // assuming `getQuery()` exists in your DTO
                filters.getLocation(),
                filters.getDateRangeStart(),
                filters.getDateRangeEnd()
        );
    }

    @Override
    public List<Organizer> searchOrganizers(String query, OrganizerFilters filters) {
        // Implement organizer search
        return organizerRepository.findByNameContainingAndLocationAndRatingGreaterThanEqual(
                query,
                filters.getLocation(),
                filters.getMinRating()
        );
    }

    @Override
    public void askQuestion(Long participantId, Long eventId, String question) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Participant not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Logic to save question would go here
        // Example: questionService.saveQuestion(participant, event, question);
    }

    @Override
    public void giveFeedback(Long participantId, Long eventId, String feedback, int rating) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Participant not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Logic to save feedback would go here
        // Example: feedbackService.saveFeedback(participant, event, feedback, rating);
    }

    @Override
    public List<Event> getEventHistory(Long participantId) {
        return eventRepository.findByParticipants_Id(participantId);
    }

    @Autowired
    private ParticipantMapper participantMapper;

    @Override
    public ParticipantDTO createParticipant(ParticipantCreateDTO participantCreateDTO) {
        // Convert DTO to Entity
        Participant participant = participantMapper.toEntity(participantCreateDTO);

        // Set default role for participant
        participant.setRole("PARTICIPANT");

        // Save to database
        Participant savedParticipant = participantRepository.save(participant);

        // Convert back to DTO
        return participantMapper.toDto(savedParticipant);
    }

    @Override
    public Participant findByEmail(String email) {
        try {
            return participantRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("Participant not found with email: " + email));
        } catch (Exception e) {
            throw new RuntimeException("Error finding participant by email: " + e.getMessage());
        }
    }


}