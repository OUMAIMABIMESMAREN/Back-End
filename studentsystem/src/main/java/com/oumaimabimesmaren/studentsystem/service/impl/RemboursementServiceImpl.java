package com.oumaimabimesmaren.studentsystem.service.impl;

import com.oumaimabimesmaren.studentsystem.dto.RemboursementRequestDTO;
import com.oumaimabimesmaren.studentsystem.dto.RemboursementResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.*;
import com.oumaimabimesmaren.studentsystem.repository.EventRepository;
import com.oumaimabimesmaren.studentsystem.repository.RemboursementRepository;
import com.oumaimabimesmaren.studentsystem.repository.ParticipantRepository;
import com.oumaimabimesmaren.studentsystem.service.RemboursementService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RemboursementServiceImpl implements RemboursementService {

    @Autowired private RemboursementRepository remboursementRepository;
    @Autowired private EventRepository eventRepository;
    @Autowired private ParticipantRepository participantRepository;

    @Override
    public void validateRemboursement(Long organizerId, Long participantId, Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        if (!event.getOrganizer().getId().equals(organizerId)) {
            throw new SecurityException("You are not authorized to validate reimbursements for this event.");
        }

        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new IllegalArgumentException("Participant not found"));

        Remboursement remboursement = new Remboursement();
        remboursement.setEvent(event);
        remboursement.setParticipant(participant);
        remboursement.setAmount(20.0); // Could be passed as param or calculated
        remboursement.setStatus("VALIDATED");
        remboursement.setRequestDate(LocalDateTime.now());

        remboursementRepository.save(remboursement);
    }

    @Override
    public String checkRemboursementStatus(Long participantId, Long eventId) {
        return remboursementRepository.findByParticipantIdAndEventId(participantId, eventId)
                .map(Remboursement::getStatus)
                .orElse("NOT_TREATED");
    }

    @Override
    public List<RemboursementResponseDTO> getAllValidatedRemboursements() {
        List<Remboursement> list = remboursementRepository.findByStatus("VALIDATED");
        return list.stream().map(r -> {
            RemboursementResponseDTO dto = new RemboursementResponseDTO();
            dto.setId(r.getId());
            dto.setParticipantId(r.getParticipant().getId());
            dto.setParticipantName(r.getParticipant().getF_name() + " " + r.getParticipant().getL_name());
            dto.setEventId(r.getEvent().getId());
            dto.setEventTitle(r.getEvent().getTitle());
            dto.setAmount(r.getAmount());
            dto.setStatus(r.getStatus());
            dto.setRequestDate(r.getRequestDate());
            return dto;
        }).toList();
    }

    public RemboursementResponseDTO createRemboursement(RemboursementRequestDTO dto) {
        Participant participant = participantRepository.findById(dto.getParticipantId())
                .orElseThrow(() -> new EntityNotFoundException("Participant not found"));
        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        Remboursement remboursement = new Remboursement();
        remboursement.setParticipant(participant);
        remboursement.setEvent(event);
        remboursement.setAmount(dto.getAmount());
        remboursement.setStatus(dto.getStatus());
        remboursement.setRequestDate(dto.getRequestDate());

        remboursementRepository.save(remboursement);

        return new RemboursementResponseDTO(
                remboursement.getId(),
                participant.getId(),
                participant.getF_name() + " " + participant.getL_name(),
                event.getId(),
                event.getTitle(),
                remboursement.getAmount(),
                remboursement.getStatus(),
                remboursement.getRequestDate()
        );
    }



    @Override
    public RemboursementResponseDTO getRemboursementById(Long id) {
        Remboursement remboursement = remboursementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Remboursement not found"));

        return new RemboursementResponseDTO(
                remboursement.getId(),
                remboursement.getParticipant().getId(),
                remboursement.getParticipant().getF_name() + " " + remboursement.getParticipant().getL_name(),
                remboursement.getEvent().getId(),
                remboursement.getEvent().getTitle(),
                remboursement.getAmount(),
                remboursement.getStatus(),
                remboursement.getRequestDate()
        );
    }


    @Override
    public List<RemboursementResponseDTO> getRemboursementsByOrganizerId(Long organizerId) {
        List<Remboursement> remboursements = remboursementRepository.findByEvent_Organizer_Id(organizerId);

        return remboursements.stream().map(remb -> new RemboursementResponseDTO(
                remb.getId(),
                remb.getParticipant().getId(),
                remb.getParticipant().getF_name() + " " + remb.getParticipant().getL_name(),
                remb.getEvent().getId(),
                remb.getEvent().getTitle(),
                remb.getAmount(),
                remb.getStatus(),
                remb.getRequestDate()
        )).collect(Collectors.toList());
    }


}
