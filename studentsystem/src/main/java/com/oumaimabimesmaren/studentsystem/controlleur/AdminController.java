package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.dto.*;
import com.oumaimabimesmaren.studentsystem.mapper.EventMapper;
import com.oumaimabimesmaren.studentsystem.mapper.OrganizerMapper;
import com.oumaimabimesmaren.studentsystem.model.*;
import com.oumaimabimesmaren.studentsystem.repository.ContractRepository;
import com.oumaimabimesmaren.studentsystem.repository.OrganizerRepository;
import com.oumaimabimesmaren.studentsystem.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private OrganizerRepository organizerRepository;


    @PostMapping("/users")
    public UserResponseDTO addUser(@RequestBody User user) {
        return adminService.addUser(user);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok("User Deleted Successfully");
    }

    @PostMapping("/organizers/{organizerId}/review")
    public ResponseEntity<OrganizerResponseDTO> reviewOrganizer(
            @PathVariable Long organizerId,
            @RequestParam boolean approve) {
        Organizer reviewed = adminService.reviewOrganizerAccount(organizerId, approve);
        OrganizerResponseDTO dto = OrganizerMapper.toResponseDTO(reviewed); // See next step
        return ResponseEntity.ok(dto);
    }


    @PostMapping("/{adminId}/events/{eventId}/validate")
    public ResponseEntity<EventResponseDTO> validateEvent(
            @PathVariable Long eventId,
            @RequestParam boolean isValidated,
            @PathVariable Long adminId) {
        Event event = adminService.validateEventModifications(eventId, isValidated, adminId);
        EventResponseDTO dto = EventMapper.toResponseDTO(event);
        return ResponseEntity.ok(dto);
    }


    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<ApiResponse<String>> deleteEvent(@PathVariable Long eventId) {
        adminService.deleteEvent(eventId);
        return ResponseEntity.ok(new ApiResponse<>("success", "Event deleted", "Event ID: " + eventId));
    }

    @PostMapping("/events/{eventId}/validate-new")
    public Event validateNewEvent(
            @PathVariable Long eventId,
            @RequestParam boolean validate) {
        return adminService.validateNewEvent(eventId, validate);
    }

    @PostMapping("/events/{eventId}/cancellation-notification")
    public void handleCancellation(
            @PathVariable Long eventId,
            @RequestParam String reason) {
        adminService.handleCancellationNotification(eventId, reason);
    }
    @PostMapping("/create")
    public ResponseEntity<AdminResponseDTO> createAdmin(@Valid @RequestBody AdminDTO adminDTO) {
        AdminResponseDTO savedAdmin = adminService.createAdmin(adminDTO);
        return new ResponseEntity<>(savedAdmin, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<AdminResponseDTO> updateAdmin(@PathVariable Long id, @RequestBody AdminDTO adminDTO) {
        AdminResponseDTO updatedAdmin = adminService.updateAdmin(id, adminDTO);
        return ResponseEntity.ok(updatedAdmin);
    }


    @PostMapping("/contracts/{organizerId}")
    public ResponseEntity<?> createAndSendContract(@PathVariable Long organizerId) {
        Organizer organizer = organizerRepository.findById(organizerId)
                .orElseThrow(() -> new RuntimeException("Organizer not found"));

        String content = generateContractContent(organizer);

        Contract contract = Contract.builder()
                .content(content)
                .signed(false)
                .createdAt(LocalDateTime.now())
                .organizer(organizer)
                .build();

        contractRepository.save(contract);

        return ResponseEntity.ok("Contract automatically created and sent to organizer " + organizerId);
    }

    private String generateContractContent(Organizer organizer) {
        String fullName = organizer.getF_name() + " " + organizer.getL_name();
        String currentDate = LocalDateTime.now().toLocalDate().toString();

        return """
        📄 Contract Text for Organizers

        Platform: GetUrTicket
        Subject: Organizer Responsibility Agreement

        This agreement is made between the platform GetUrTicket (hereinafter referred to as "the Platform")
        and the Event Organizer %s (hereinafter referred to as "the Organizer").

        By accepting this contract, the Organizer agrees to the following terms and conditions:

        1. Integrity and Ethical Conduct
           The Organizer commits to maintaining honesty and integrity in all dealings related to event creation,
           promotion, and ticket sales on the Platform.

        2. Responsibility to Attendees
           The Organizer shall not misuse the Platform for fraudulent purposes, including but not limited to:
           - Creating fake or misleading events.
           - Canceling events at the last moment with the intent to avoid reimbursements.
           - Collecting ticket payments without delivering the promised event or services.

        3. Transparency and Information Disclosure
           The Organizer agrees to provide accurate, complete, and verifiable information about themselves and
           their organization. This includes:
           - Legal name and contact information.
           - Identification or business registration documents.
           - Bank account details for payment and refund purposes.

        4. Event Management Standards
           The Organizer shall:
           - Ensure that the event details (date, time, venue, lineup, etc.) are accurate and updated promptly.
           - Take full responsibility for the smooth running of the event.
           - Manage cancellations responsibly and offer refunds where applicable.

        5. Communication and Cooperation
           The Organizer agrees to remain responsive to communication from the Platform and event attendees.
           In case of any issue, the Organizer will collaborate with the Platform to resolve matters in good faith.

        6. Refund and Reimbursement Policy
           In case of event cancellation or failure to deliver as promised, the Organizer is obligated to reimburse
           affected participants promptly and fairly, as governed by Platform policies.

        7. Breach and Penalties
           Any breach of this agreement may result in:
           - Termination of the Organizer’s access to the Platform.
           - Legal action or financial penalties.
           - Public notification of misconduct, if necessary, to protect users.

        8. Governing Law
           This agreement shall be governed by the laws applicable in the jurisdiction of the Platform's registration.

        By signing this contract, the Organizer acknowledges they have read, understood, and agreed to the above terms.

        Signed digitally by:
        The GetUrTicket Platform Team
        Date: %s
        """.formatted(fullName, currentDate);
    }



}
