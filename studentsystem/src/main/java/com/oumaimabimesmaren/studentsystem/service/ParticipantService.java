package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.dto.*;
import com.oumaimabimesmaren.studentsystem.model.Event;
import com.oumaimabimesmaren.studentsystem.model.Organizer;
import com.oumaimabimesmaren.studentsystem.model.Participant;

import java.util.List;

public interface ParticipantService {
    List<Event> searchEvents(EventSearchDTO filters);
    List<Organizer> searchOrganizers(String query, OrganizerFilters filters);
    void askQuestion(Long participantId, Long eventId, String question);
    void giveFeedback(Long participantId, Long eventId, String feedback, int rating);
    List<Event> getEventHistory(Long participantId);
    List<ParticipantResponseDTO> getAllParticipants();
    ParticipantDTO createParticipant(ParticipantCreateDTO participantCreateDTO);
    Participant findByEmail(String email);
    ParticipantResponseDTO getParticipantById(Long id);
    ParticipantResponseDTO updateProfile(String email, ParticipantUpdateDTO updateDTO);
    ParticipantResponseDTO updateNewsletterFrequency(String email, String frequency);

}