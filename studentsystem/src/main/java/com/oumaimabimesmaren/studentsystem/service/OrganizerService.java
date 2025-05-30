package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.dto.OrganizerDashboardDTO;
import com.oumaimabimesmaren.studentsystem.dto.OrganizerResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Organizer;
import com.oumaimabimesmaren.studentsystem.model.Participant;
import java.util.List;

public interface OrganizerService {
    void saisirPortfolio(Long organizerId, String portfolioDetails);
    void signContract(Long organizerId, String contractDetails);
    void validateRemboursement(Long organizerId, Long participantId, Long eventId);
    void rembourserParticipant(Long organizerId, Long participantId, Long eventId, Double amount);
    String checkRemboursementStatus(Long participantId, Long eventId);
//    OrganizerDashboardDTO consultDashboard(Long organizerId);
    List<Participant> getEventParticipants(Long eventId);
    OrganizerDashboardDTO getOrganizerDashboard(Long organizerId);
    Organizer getOrganizerById(Long id);
    List<Organizer> getAllOrganizers();
    Organizer updateOrganizer(Long id, Organizer updatedData);
    List<OrganizerResponseDTO> searchOrganizers(String name, String location, String category);
}