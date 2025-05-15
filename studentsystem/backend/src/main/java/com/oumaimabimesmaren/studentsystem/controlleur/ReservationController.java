package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.dto.CancellationResult;
import com.oumaimabimesmaren.studentsystem.dto.ReservationResponseDTO;
import com.oumaimabimesmaren.studentsystem.mapper.ReservationMapper;
import com.oumaimabimesmaren.studentsystem.model.Reservation;
import com.oumaimabimesmaren.studentsystem.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private ReservationMapper reservationMapper;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationResponseDTO>> getAllReservations() {
        List<ReservationResponseDTO> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTICIPANT', 'ORGANIZER')")
    public ResponseEntity<ReservationResponseDTO> getReservationById(@PathVariable Long id) {
        ReservationResponseDTO reservation = reservationService.getReservationById(id);
        return ResponseEntity.ok(reservation);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('PARTICIPANT')")
    public ResponseEntity<List<ReservationResponseDTO>> getMyReservations(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body(null);
        }
        List<ReservationResponseDTO> reservations = reservationService.getMyReservations(authentication.getName());
        return ResponseEntity.ok(reservations);
    }

    @PostMapping
    @PreAuthorize("hasRole('PARTICIPANT')")
    public ResponseEntity<ReservationResponseDTO> createReservation(
            Authentication authentication,
            @RequestBody CreateReservationDTO createDTO) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body(null);
        }
        ReservationResponseDTO reservation = reservationService.createReservation(authentication.getName(), createDTO.getEventId());
        return ResponseEntity.ok(reservation);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTICIPANT')")
    public ResponseEntity<ReservationResponseDTO> updateReservation(
            @PathVariable Long id,
            @RequestBody UpdateReservationDTO updateDTO) {
        ReservationResponseDTO updated = reservationService.updateReservation(id, updateDTO);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTICIPANT')")
    public ResponseEntity<CancellationResult> cancelReservation(
            @PathVariable Long id,
            @RequestBody CancelReservationDTO cancelDTO) {
        CancellationResult result = reservationService.cancelReservation(id, cancelDTO.getReason());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/confirm")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public ResponseEntity<Void> confirmReservation(@PathVariable Long id) {
        reservationService.confirmReservation(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/participant/{participantId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public ResponseEntity<List<ReservationResponseDTO>> getParticipantReservations(@PathVariable Long participantId) {
        List<ReservationResponseDTO> reservations = reservationService.getParticipantReservations(participantId);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public ResponseEntity<List<ReservationResponseDTO>> getEventReservations(@PathVariable Long eventId) {
        List<ReservationResponseDTO> reservations = reservationService.getEventReservations(eventId);
        return ResponseEntity.ok(reservations);
    }
}
