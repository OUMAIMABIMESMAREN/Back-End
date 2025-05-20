package com.oumaimabimesmaren.studentsystem.service.impl;
import com.oumaimabimesmaren.studentsystem.dto.EventSummaryDTO;
import com.oumaimabimesmaren.studentsystem.dto.OrganizerDashboardDTO;
import com.oumaimabimesmaren.studentsystem.dto.ParticipantDTO;
import com.oumaimabimesmaren.studentsystem.model.Event;
import com.oumaimabimesmaren.studentsystem.model.Organizer;
import com.oumaimabimesmaren.studentsystem.model.Participant;
import com.oumaimabimesmaren.studentsystem.model.Remboursement;
import com.oumaimabimesmaren.studentsystem.repository.*;
import com.oumaimabimesmaren.studentsystem.service.OrganizerService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrganizerServiceImpl implements OrganizerService {
    @Autowired private OrganizerRepository organizerRepository;
    @Autowired private ParticipantRepository participantRepository;
    @Autowired private EventRepository eventRepository;
    @Autowired private RemboursementRepository remboursementRepository;
    @Autowired private PaiementRepository paiementRepository;
    @Autowired private TicketRepository ticketRepository;
    @Autowired private PublicationRepository publicationRepository;

    @Override
    public void saisirPortfolio(Long organizerId, String portfolioDetails) {
        // Implementation with validation
        System.out.println("Portfolio submitted for organizer: " + organizerId);
    }

    @Override
    public void signContract(Long organizerId, String contractDetails) {
        // Implementation with contract processing
        System.out.println("Contract signed for organizer: " + organizerId);
    }

    @Override
    @Transactional
    public void validateRemboursement(Long organizerId, Long participantId, Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        if (!event.getOrganizer().getId().equals(organizerId)) {
            throw new SecurityException("Organizer doesn't own this event");
        }

        Remboursement remboursement = remboursementRepository.findByEvent_IdAndParticipant_Id(eventId, participantId)
                .orElseThrow(() -> new EntityNotFoundException("Remboursement not found for participant and event"));

        remboursement.setStatus("VALIDATED");
        remboursementRepository.save(remboursement);
    }




    @Override
    public void rembourserParticipant(Long organizerId, Long participantId, Long eventId, Double amount) {
        // Similar security check + reimbursement logic
        System.out.println("Reimbursing " + amount + " to participant: " + participantId);
    }

    @Override
    public String checkRemboursementStatus(Long participantId, Long eventId) {
        // Implementation would check database
        return "PROCESSING"; // Example status
    }

    @Override
    public List<Participant> getEventParticipants( Long eventId) {
        // Verify organizer owns the event first
        return participantRepository.findByEventId(eventId);
    }

    @Override
    public OrganizerDashboardDTO getOrganizerDashboard(Long organizerId) {
        Organizer organizer = organizerRepository.findById(organizerId)
                .orElseThrow(() -> new EntityNotFoundException("Organizer not found"));

        String organizerName = organizer.getF_name() + " " + organizer.getL_name();
        int totalEvents = eventRepository.countByOrganizerId(organizerId);
        int totalParticipants = participantRepository.countDistinctParticipantsByOrganizerId(organizerId);
        int totalTicketsSold = ticketRepository.countTicketsByOrganizerId(organizerId);
        double totalRevenue = paiementRepository.sumRevenueByOrganizerId(organizerId);
        int pendingReimbursements = remboursementRepository.countPendingByOrganizerId(organizerId);
        int totalPublications = publicationRepository.countByOrganizerId(organizerId);

        List<EventSummaryDTO> upcomingEvents = eventRepository.findUpcomingEventsByOrganizerId(organizerId)
                .stream()
                .map(event -> new EventSummaryDTO(
                        event.getId(),
                        event.getTitle(),
                        event.getEventDate(),
                        event.getLieu(),
                        event.getPrice()
                ))
                .collect(Collectors.toList());

        return new OrganizerDashboardDTO(
                organizerName,
                totalEvents,
                totalParticipants,
                totalRevenue,
                totalTicketsSold,
                pendingReimbursements,
                totalPublications,
                upcomingEvents
        );
    }
    @Override
    public Organizer getOrganizerById(Long id) {
        return organizerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Organizer with ID " + id + " not found"));
    }

    @Override
    public List<Organizer> getAllOrganizers() {
        return organizerRepository.findAll();
    }

    @Override
    public Organizer updateOrganizer(Long id, Organizer updatedData) {
        Organizer existing = organizerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Organizer with ID " + id + " not found"));

        existing.setF_name(updatedData.getF_name());
        existing.setL_name(updatedData.getL_name());
        existing.setEmail(updatedData.getEmail());
        existing.setVille(updatedData.getVille());
        existing.setAddress(updatedData.getAddress());
        existing.setRating(updatedData.getRating());
        existing.setStatus(updatedData.getStatus());

        return organizerRepository.save(existing);
    }


}