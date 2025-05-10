package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.dto.EventSearchDTO;
import com.oumaimabimesmaren.studentsystem.dto.OrganizerFilters;
import com.oumaimabimesmaren.studentsystem.dto.ParticipantCreateDTO;
import com.oumaimabimesmaren.studentsystem.dto.ParticipantDTO;
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

    ParticipantDTO createParticipant(ParticipantCreateDTO participantCreateDTO);
    Participant findByEmail(String email);

}