package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.dto.CancellationResult;
import com.oumaimabimesmaren.studentsystem.dto.ReservationResponseDTO;
import com.oumaimabimesmaren.studentsystem.dto.UpdateReservationDTO;
import com.oumaimabimesmaren.studentsystem.model.Reservation;

import java.util.List;

public interface ReservationService {
    List<ReservationResponseDTO> getAllReservations();
    ReservationResponseDTO getReservationById(Long id);
    List<ReservationResponseDTO> getMyReservations(String email);
    ReservationResponseDTO createReservation(String email, Long eventId);
    ReservationResponseDTO updateReservation(Long id, UpdateReservationDTO updateDTO);
    CancellationResult cancelReservation(Long reservationId, String reason);
    void confirmReservation(Long reservationId);
    List<ReservationResponseDTO> getParticipantReservations(Long participantId);
    List<ReservationResponseDTO> getEventReservations(Long eventId);
    CancellationResult adminCancelReservation(Long reservationId, String reason);
}