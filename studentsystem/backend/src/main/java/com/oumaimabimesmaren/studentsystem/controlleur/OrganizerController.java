package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.dto.OrganizerDashboardDTO;
import com.oumaimabimesmaren.studentsystem.dto.ParticipantDTO;
import com.oumaimabimesmaren.studentsystem.dto.PortfolioDTO;
import com.oumaimabimesmaren.studentsystem.dto.RemboursementResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Contract;
import com.oumaimabimesmaren.studentsystem.model.Participant;
import com.oumaimabimesmaren.studentsystem.model.Remboursement;
import com.oumaimabimesmaren.studentsystem.repository.ContractRepository;
import com.oumaimabimesmaren.studentsystem.repository.ParticipantRepository;
import com.oumaimabimesmaren.studentsystem.repository.ReservationRepository;
import com.oumaimabimesmaren.studentsystem.service.OrganizerService;
import com.oumaimabimesmaren.studentsystem.service.RemboursementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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
    public OrganizerController(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

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
    @PostMapping("/portfolio")
    public void submitPortfolio(@RequestParam Long organizerId,
                                @RequestBody PortfolioDTO portfolioDTO) {
        organizerService.saisirPortfolio(organizerId, portfolioDTO.getPortfolioDetails());
    }

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


    // Validate reimbursement
    @PostMapping("/events/{eventId}/participants/{participantId}/validate-remboursement")
    public ResponseEntity<String> validateRemboursement(@PathVariable Long eventId,
                                                        @PathVariable Long participantId,
                                                        @RequestParam Long organizerId) {
        organizerService.validateRemboursement(organizerId, participantId, eventId);
        return ResponseEntity.ok("Reimboursement validated successfully! ");
    }

    // Check reimbursement status
    @GetMapping("/events/{eventId}/participants/{participantId}/remboursement-status")
    public ResponseEntity<String> checkRemboursementStatus(@PathVariable Long eventId,
                                                           @PathVariable Long participantId) {
        String status = organizerService.checkRemboursementStatus(participantId, eventId);
        return ResponseEntity.ok("Status: " + status);
    }

    @Autowired
    private RemboursementService remboursementService;

    @GetMapping("/remboursements/validated")
    public ResponseEntity<List<RemboursementResponseDTO>> getAllValidatedRemboursements() {
        List<RemboursementResponseDTO> reimbursed = remboursementService.getAllValidatedRemboursements();
        return ResponseEntity.ok(reimbursed);
    }

    @GetMapping("/{organizerId}/dashboard")
    public ResponseEntity<OrganizerDashboardDTO> consultDashboard(@PathVariable Long organizerId) {
        OrganizerDashboardDTO dashboard = organizerService.getOrganizerDashboard(organizerId);
        return ResponseEntity.ok(dashboard);
    }


}