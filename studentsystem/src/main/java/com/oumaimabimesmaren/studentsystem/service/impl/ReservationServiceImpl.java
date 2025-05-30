package com.oumaimabimesmaren.studentsystem.service.impl;

import com.oumaimabimesmaren.studentsystem.dto.CancellationResult;
import com.oumaimabimesmaren.studentsystem.dto.ReservationResponseDTO;
import com.oumaimabimesmaren.studentsystem.dto.UpdateReservationDTO;
import com.oumaimabimesmaren.studentsystem.exception.ResourceNotFoundException;
import com.oumaimabimesmaren.studentsystem.mapper.ReservationMapper;
import com.oumaimabimesmaren.studentsystem.model.*;
import com.oumaimabimesmaren.studentsystem.repository.*;
import com.oumaimabimesmaren.studentsystem.service.CancellationPolicyService;
import com.oumaimabimesmaren.studentsystem.service.NotificationService;
import com.oumaimabimesmaren.studentsystem.service.ParticipantService;
import com.oumaimabimesmaren.studentsystem.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@Service
public class ReservationServiceImpl implements ReservationService {

    private static final Logger logger = LoggerFactory.getLogger(ReservationServiceImpl.class);

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private CancellationPolicyService policyService;

    @Autowired
    private ReservationMapper reservationMapper;

    @Autowired
    private ParticipantService participantService;

    @Override
    public List<ReservationResponseDTO> getAllReservations() {
        List<Reservation> reservations = reservationRepository.findAll();
        return reservations.stream()
                .map(ReservationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ReservationResponseDTO getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", id));
        return reservationMapper.toResponseDTO(reservation);
    }

    @Override
    public List<ReservationResponseDTO> getMyReservations(String email, String status) {
        Participant participant = participantRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Participant not found"));

        List<Reservation> reservations = reservationRepository.findByParticipantId(participant.getId());
        LocalDateTime now = LocalDateTime.now();

        return reservations.stream()
                .filter(reservation -> {
                    switch (status.toLowerCase()) {
                        case "upcoming":
                            return reservation.getBookingStatus().equals("CONFIRMED") &&
                                   reservation.getEvent().getEventDate().isAfter(now);
                        case "past":
                            return reservation.getBookingStatus().equals("CONFIRMED") &&
                                   reservation.getEvent().getEventDate().isBefore(now);
                        case "cancelled":
                            return reservation.getBookingStatus().equals("CANCELLED");
                        default:
                            return true;
                    }
                })
                .map(ReservationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ReservationResponseDTO createReservation(String email, Long eventId) {
        Participant participant = participantService.findByEmail(email);
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", eventId));

        if (reservationRepository.countByEventId(eventId) >= event.getCapacity()) {
            throw new IllegalStateException("Event is fully booked");
        }

        Reservation reservation = new Reservation(participant, event);
        Reservation saved = reservationRepository.save(reservation);

        return reservationMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional
    public ReservationResponseDTO updateReservation(Long id, UpdateReservationDTO updateDTO) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", id));

        if (updateDTO.getNewEventId() != null) {
            Event newEvent = eventRepository.findById(updateDTO.getNewEventId())
                    .orElseThrow(() -> new ResourceNotFoundException("Event", updateDTO.getNewEventId()));
            reservation.modifyReservation(newEvent);
        }

        if (updateDTO.getStatus() != null) {
            reservation.setStatus(updateDTO.getStatus());
        }

        if (updateDTO.getQuantity() != null) {
            reservation.setQuantity(updateDTO.getQuantity());
        }

        Reservation updated = reservationRepository.save(reservation);
        return reservationMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional
    public void confirmReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", reservationId));

        reservation.confirm();
        reservationRepository.save(reservation);

        notificationService.sendConfirmationNotification(reservation.getParticipant(), reservation);
    }

    @Override
    public List<ReservationResponseDTO> getParticipantReservations(Long participantId) {
        List<Reservation> reservations = reservationRepository.findByParticipantId(participantId);
        return reservations.stream()
                .map(ReservationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReservationResponseDTO> getEventReservations(Long eventId) {
        List<Reservation> reservations = reservationRepository.findByEventId(eventId);
        return reservations.stream()
                .map(ReservationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CancellationResult cancelReservation(Long reservationId, String reason) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", reservationId));

        if (reservation.getCancellationPolicy() == null) {
            throw new IllegalStateException("Cancellation policy is undefined");
        }

        Date now = new Date();
        boolean isLateCancellation = now.after(reservation.getCancellationDeadline());
        double refundAmount = 0.0;

        switch (reservation.getCancellationPolicy()) {
            case FREE_CANCELLATION:
                if (isLateCancellation) throw new IllegalStateException("Free cancellation period expired");
                refundAmount = reservation.getEvent().getPrice();
                break;
            case REFUNDABLE:
                refundAmount = isLateCancellation
                        ? reservation.getEvent().getPrice() - reservation.getPenaltyAmount()
                        : reservation.getEvent().getPrice();
                break;
            case NON_REFUNDABLE:
                if (isLateCancellation) throw new IllegalStateException("No refunds allowed for this reservation");
                break;
        }

        if (refundAmount > 0) {
            processRefund(reservation, refundAmount);
        }

        reservation.cancel(reason);
        reservationRepository.save(reservation);

        notificationService.sendCancellationNotification(reservation.getEvent().getOrganizer(), reservation, reason);

        return new CancellationResult(
                reservation.getId(),
                isLateCancellation ? reservation.getPenaltyAmount() : 0.0,
                refundAmount > 0
        );
    }

    @Override
    @Transactional
    public CancellationResult adminCancelReservation(Long reservationId, String reason) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", reservationId));

        reservation.cancel(reason);
        reservationRepository.save(reservation);

        processRefund(reservation, reservation.getEvent().getPrice());

        notificationService.sendAdminCancellationNotification(reservation.getParticipant(), reservation, reason);

        return new CancellationResult(reservation.getId(), 0.0, true);
    }

    private void processRefund(Reservation reservation, Double amount) {
        logger.info("Processing refund of {} for reservation ID {}", amount, reservation.getId());
        reservation.setRefundProcessed(true);
    }
}
