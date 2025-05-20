package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.dto.ModifyPanierRequest;
import com.oumaimabimesmaren.studentsystem.dto.PanierResponseDTO;
import com.oumaimabimesmaren.studentsystem.dto.ReservationResponseDTO;
import com.oumaimabimesmaren.studentsystem.mapper.PanierMapper;
import com.oumaimabimesmaren.studentsystem.model.Panier;
import com.oumaimabimesmaren.studentsystem.model.Reservation;
import com.oumaimabimesmaren.studentsystem.service.PanierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paniers")
public class PanierController {

    @Autowired
    private PanierService panierService;

    // 1. Create a panier for a participant
    @PostMapping("/participant/{participantId}/create")
    public ResponseEntity<PanierResponseDTO> createPanier(@PathVariable Long participantId) {
        Panier panier = panierService.createPanier(participantId);
        return ResponseEntity.ok(PanierMapper.toDTO(panier));
    }

    // 2. Add reservations to a panier
    @PostMapping("/{panierId}/add")
    public ResponseEntity<PanierResponseDTO> addToPanier(@PathVariable Long panierId,
                                                         @RequestBody List<Long> reservationIds) {
        Panier updatedPanier = panierService.addExistingReservationsToPanier(panierId, reservationIds);
        return ResponseEntity.ok(PanierMapper.toDTO(updatedPanier));
    }

    // 3. Validate panier
    @PostMapping("/{panierId}/validate")
    public ResponseEntity<PanierResponseDTO> validatePanier(@PathVariable Long panierId) {
        Panier panier = panierService.validatePanier(panierId);
        return ResponseEntity.ok(PanierMapper.toDTO(panier));
    }

    // ✅ 4. Modify panier contents using @RequestBody
    @PutMapping("/{panierId}/modify")
    public ResponseEntity<PanierResponseDTO> modifyPanier(@PathVariable Long panierId,
                                                          @RequestBody ModifyPanierRequest request) {
        Panier modifiedPanier = panierService.modifyPanier(panierId, request.getToAdd(), request.getToRemove());
        return ResponseEntity.ok(PanierMapper.toDTO(modifiedPanier));
    }

    // 5. Cancel panier
    @DeleteMapping("/{panierId}/cancel")
    public void cancelPanier(@PathVariable Long panierId) {
        panierService.cancelPanier(panierId);
    }

    // 6. Get current panier for a participant
    @GetMapping("/participant/{participantId}/current")
    public ResponseEntity<PanierResponseDTO> getCurrentPanier(@PathVariable Long participantId) {
        Panier CurrentPanier = panierService.getCurrentPanier(participantId);
        return ResponseEntity.ok(PanierMapper.toDTO(CurrentPanier));
    }
}
