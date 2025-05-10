package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.dto.CancellationResult;
import com.oumaimabimesmaren.studentsystem.dto.ReservationResponseDTO;
import com.oumaimabimesmaren.studentsystem.mapper.ReservationMapper;
import com.oumaimabimesmaren.studentsystem.model.Reservation;
import com.oumaimabimesmaren.studentsystem.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private ReservationMapper reservationMapper;

    @PostMapping("/create")
    public ReservationResponseDTO createReservation(
            @RequestParam Long participantId,
            @RequestParam Long eventId) {
        return reservationService.createReservation(participantId, eventId);
    }


    @PutMapping("/modify")
    public ReservationResponseDTO modifyReservation(@RequestParam Long reservationId, @RequestParam Long newEventId) {
        return reservationService.modifyReservation(reservationId, newEventId);
    }

    @PostMapping("/{id}/cancel")
    public CancellationResult cancelReservation(
            @PathVariable Long id,
            @RequestParam String reason,
            @RequestParam(required = false) Boolean forceCancel) {
        if (Boolean.TRUE.equals(forceCancel)) {
            return reservationService.adminCancelReservation(id, reason);
        }
        return reservationService.cancelReservation(id, reason);
    }

    @PostMapping("/{id}/confirm")
    public void confirmReservation(@PathVariable Long id) {
        reservationService.confirmReservation(id);
    }

    @GetMapping("/participant/{participantId}")
    public List<ReservationResponseDTO> getParticipantReservations(@PathVariable Long participantId) {
        return reservationService.getParticipantReservations(participantId);
    }
}
