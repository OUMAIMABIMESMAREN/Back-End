package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.dto.*;
import com.oumaimabimesmaren.studentsystem.mapper.OrganizerMapper;
import com.oumaimabimesmaren.studentsystem.model.Contract;
import com.oumaimabimesmaren.studentsystem.model.Organizer;
import com.oumaimabimesmaren.studentsystem.model.Participant;
import com.oumaimabimesmaren.studentsystem.repository.ContractRepository;
import com.oumaimabimesmaren.studentsystem.repository.ParticipantRepository;
import com.oumaimabimesmaren.studentsystem.repository.ReservationRepository;
import com.oumaimabimesmaren.studentsystem.service.OrganizerService;
import com.oumaimabimesmaren.studentsystem.service.RemboursementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
// other imports...

@RestController
@RequestMapping("/api/organizer")
public class OrganizerController {

    @Autowired
    private OrganizerService organizerService;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private ContractRepository contractRepository;

    private final ReservationRepository reservationRepository;

    @Autowired
    private RemboursementService remboursementService;

    @Autowired
    public OrganizerController(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    // ✅ GET /api/organizer - Get all organizers
    @GetMapping("/All")
    public ResponseEntity<List<OrganizerResponseDTO>> getAllOrganizers() {
        List<Organizer> organizers = organizerService.getAllOrganizers();
        List<OrganizerResponseDTO> dtos = organizers.stream()
                .map(OrganizerMapper::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // ✅ GET /api/organizer/{id} - Get organizer by ID
    @GetMapping("/{id}")
    public ResponseEntity<OrganizerResponseDTO> getOrganizerById(@PathVariable Long id) {
        Organizer organizer = organizerService.getOrganizerById(id);
        return ResponseEntity.ok(OrganizerMapper.toResponseDTO(organizer));
    }

    // ✅ PUT /api/organizer/{id} - Update organizer
    @PutMapping("/{id}")
    public ResponseEntity<OrganizerResponseDTO> updateOrganizer(@PathVariable Long id,
                                                                @RequestBody Organizer updatedData) {
        Organizer updated = organizerService.updateOrganizer(id, updatedData);
        return ResponseEntity.ok(OrganizerMapper.toResponseDTO(updated));
    }

    // ✅ Already implemented
    @GetMapping("/{organizerId}/dashboard")
    public ResponseEntity<OrganizerDashboardDTO> consultDashboard(@PathVariable Long organizerId) {
        OrganizerDashboardDTO dashboard = organizerService.getOrganizerDashboard(organizerId);
        return ResponseEntity.ok(dashboard);
    }

    // ✅ Already implemented
    @GetMapping("/{organizerId}/events/{eventId}/participants")
    public ResponseEntity<?> getEventParticipants(@PathVariable Long organizerId, @PathVariable Long eventId) {
        List<Participant> participants = reservationRepository.findParticipantsByEventId(eventId);
        List<ParticipantDTO> dtos = participants.stream()
                .map(participant -> new ParticipantDTO(
                        participant.getId(),
                        participant.getF_name() + " " + participant.getL_name(),
                        participant.getEmail(),
                        participant.getAttendanceStatus()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    // ✅ Already implemented
    @PostMapping("/events/{eventId}/participants/{participantId}/validate-remboursement")
    public ResponseEntity<String> validateRemboursement(@PathVariable Long eventId,
                                                        @PathVariable Long participantId,
                                                        @RequestParam Long organizerId) {
        organizerService.validateRemboursement(organizerId, participantId, eventId);
        return ResponseEntity.ok("Reimboursement validated successfully! ");
    }

    // ✅ Already implemented
    @GetMapping("/events/{eventId}/participants/{participantId}/remboursement-status")
    public ResponseEntity<String> checkRemboursementStatus(@PathVariable Long eventId,
                                                           @PathVariable Long participantId) {
        String status = organizerService.checkRemboursementStatus(participantId, eventId);
        return ResponseEntity.ok("Status: " + status);
    }

    // ✅ Already implemented
    @GetMapping("/remboursements/validated")
    public ResponseEntity<List<RemboursementResponseDTO>> getAllValidatedRemboursements() {
        List<RemboursementResponseDTO> reimbursed = remboursementService.getAllValidatedRemboursements();
        return ResponseEntity.ok(reimbursed);
    }

    // ✅ Already implemented
    @PostMapping("/{organizerId}/sign-contract")
    public ResponseEntity<?> signContract(@PathVariable Long organizerId) {
        Contract contract = contractRepository.findByOrganizerId(organizerId)
                .orElseThrow(() -> new RuntimeException("No contract found"));

        if (contract.isSigned()) {
            return ResponseEntity.badRequest().body("Contract already signed");
        }

        contract.setSigned(true);
        contract.setSignedAt(LocalDateTime.now());
        contractRepository.save(contract);

        return ResponseEntity.ok("Contract signed successfully");
    }

    // ✅ Already implemented
    @PostMapping("/portfolio")
    public void submitPortfolio(@RequestParam Long organizerId,
                                @RequestBody PortfolioDTO portfolioDTO) {
        organizerService.saisirPortfolio(organizerId, portfolioDTO.getPortfolioDetails());
    }
}
