package com.oumaimabimesmaren.studentsystem.service.impl;

import com.oumaimabimesmaren.studentsystem.dto.CancellationResult;
import com.oumaimabimesmaren.studentsystem.dto.ReservationResponseDTO;
import com.oumaimabimesmaren.studentsystem.exception.ResourceNotFoundException;
import com.oumaimabimesmaren.studentsystem.mapper.ReservationMapper;
import com.oumaimabimesmaren.studentsystem.model.*;
import com.oumaimabimesmaren.studentsystem.repository.*;
import com.oumaimabimesmaren.studentsystem.service.CancellationPolicyService;
import com.oumaimabimesmaren.studentsystem.service.NotificationService;
import com.oumaimabimesmaren.studentsystem.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

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

    @Override
    @Transactional
    public ReservationResponseDTO createReservation(Long participantId, Long eventId) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("Participant", participantId));

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
    public ReservationResponseDTO modifyReservation(Long reservationId, Long newEventId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", reservationId));
        Event newEvent = eventRepository.findById(newEventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", newEventId));

        reservation.modifyReservation(newEvent);
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
                .map(res -> new ReservationResponseDTO(
                        res.getId(),
                        res.getParticipant().getId(),
                        res.getParticipant().getF_name() + " " + res.getParticipant().getL_name(),
                        res.getEvent().getId(),
                        res.getEvent().getTitle(),
                        res.getStatus(),
                        res.getEvent().getPrice()
                ))
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
