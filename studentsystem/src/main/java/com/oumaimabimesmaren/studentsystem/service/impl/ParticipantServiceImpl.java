package com.oumaimabimesmaren.studentsystem.service.impl;

import com.oumaimabimesmaren.studentsystem.dto.*;
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
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

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

    @Override
    public List<ParticipantResponseDTO> getAllParticipants() {
        List<Participant> participants = participantRepository.findAll();
        return participants.stream()
                .map(participantMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
    @Override
    public ParticipantResponseDTO getParticipantById(Long id) {
        Participant participant = participantRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Participant with ID " + id + " not found"));
        return participantMapper.toResponseDTO(participant);
    }
    @Override
    public ParticipantResponseDTO updateProfile(String email, ParticipantUpdateDTO updateDTO) {
        Participant participant = participantRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Participant with email " + email + " not found"));

        // Update allowed fields
        if (updateDTO.getF_name() != null) {
            participant.setF_name(updateDTO.getF_name());
        }
        if (updateDTO.getL_name() != null) {
            participant.setL_name(updateDTO.getL_name());
        }
        if (updateDTO.getPhone_num() != null) {
            participant.setPhone_num(updateDTO.getPhone_num());
        }
        if (updateDTO.getAddress() != null) {
            participant.setAddress(updateDTO.getAddress());
        }

        Participant updated = participantRepository.save(participant);
        return participantMapper.toResponseDTO(updated);
    }

    @Override
    public ParticipantResponseDTO updateNewsletterFrequency(String email, String frequency) {
        Participant participant = participantRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Participant with email " + email + " not found"));

        participant.setNewsletterFrequency(frequency);  // Make sure your entity has this field & setter

        Participant updated = participantRepository.save(participant);
        return participantMapper.toResponseDTO(updated);
    }

}