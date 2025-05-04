package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.dto.RemboursementRequestDTO;
import com.oumaimabimesmaren.studentsystem.dto.RemboursementResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Remboursement;

import java.util.List;
import java.util.Optional;

public interface RemboursementService {
    void validateRemboursement(Long organizerId, Long participantId, Long eventId);
    String checkRemboursementStatus(Long participantId, Long eventId);
    List<RemboursementResponseDTO> getAllValidatedRemboursements();

    RemboursementResponseDTO createRemboursement(RemboursementRequestDTO remboursement);
    RemboursementResponseDTO getRemboursementById(Long id);
    List<RemboursementResponseDTO> getRemboursementsByOrganizerId(Long organizerId);
}
