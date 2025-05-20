package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.dto.RemboursementRequestDTO;
import com.oumaimabimesmaren.studentsystem.dto.RemboursementResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Remboursement;
import com.oumaimabimesmaren.studentsystem.service.RemboursementService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/remboursements")
@RequiredArgsConstructor
public class RemboursementController {

    private final RemboursementService remboursementService;

    // 1. Create a new remboursement
    @PostMapping("/create")
    public ResponseEntity<RemboursementResponseDTO> createRemboursement(@RequestBody RemboursementRequestDTO dto) {
        RemboursementResponseDTO created = remboursementService.createRemboursement(dto);
        return ResponseEntity.ok(created);
    }

    // 2. Get remboursement by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<RemboursementResponseDTO> getRemboursementById(@PathVariable Long id) {
        RemboursementResponseDTO dto = remboursementService.getRemboursementById(id);
        return ResponseEntity.ok(dto);
    }

    // 3. Get all remboursements for a given organizer
    @GetMapping("/organizer/{organizerId}/getAll")
    public ResponseEntity<List<RemboursementResponseDTO>> getRemboursementsByOrganizerId(@PathVariable Long organizerId) {
        List<RemboursementResponseDTO> dtos = remboursementService.getRemboursementsByOrganizerId(organizerId);
        return ResponseEntity.ok(dtos);
    }
}
