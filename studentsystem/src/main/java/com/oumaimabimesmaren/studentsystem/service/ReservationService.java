package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.dto.CancellationResult;
import com.oumaimabimesmaren.studentsystem.dto.ReservationResponseDTO;
import com.oumaimabimesmaren.studentsystem.dto.UpdateReservationDTO;
import com.oumaimabimesmaren.studentsystem.model.Reservation;
import com.oumaimabimesmaren.studentsystem.repository.ParticipantRepository;
import com.oumaimabimesmaren.studentsystem.repository.ReservationRepository;
import com.oumaimabimesmaren.studentsystem.mapper.ReservationMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public interface ReservationService {
    List<ReservationResponseDTO> getAllReservations();
    ReservationResponseDTO getReservationById(Long id);
    List<ReservationResponseDTO> getMyReservations(String email, String status);
    ReservationResponseDTO createReservation(String email, Long eventId);
    ReservationResponseDTO updateReservation(Long id, UpdateReservationDTO updateDTO);
    CancellationResult cancelReservation(Long reservationId, String reason);
    void confirmReservation(Long reservationId);
    List<ReservationResponseDTO> getParticipantReservations(Long participantId);
    List<ReservationResponseDTO> getEventReservations(Long eventId);
    CancellationResult adminCancelReservation(Long reservationId, String reason);
}