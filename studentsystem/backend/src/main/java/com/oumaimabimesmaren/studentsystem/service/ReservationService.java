package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.dto.CancellationResult;
import com.oumaimabimesmaren.studentsystem.dto.ReservationResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Reservation;

import java.util.List;

public interface ReservationService {
    ReservationResponseDTO createReservation(Long participantId, Long eventId);
    ReservationResponseDTO modifyReservation(Long reservationId, Long newEventId);
    CancellationResult cancelReservation(Long reservationId, String reason);
    void confirmReservation(Long reservationId);
    List<ReservationResponseDTO> getParticipantReservations(Long participantId);
    CancellationResult adminCancelReservation(Long reservationId, String reason);
}