package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.dto.ModifyPanierRequest;
import com.oumaimabimesmaren.studentsystem.model.Panier;
import com.oumaimabimesmaren.studentsystem.model.Reservation;
import com.oumaimabimesmaren.studentsystem.service.PanierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paniers")
public class PanierController {

    @Autowired
    private PanierService panierService;

    // 1. Create a panier for a participant
    @PostMapping("/participant/{participantId}")
    public Panier createPanier(@PathVariable Long participantId) {
        return panierService.createPanier(participantId);
    }

    // 2. Add reservations to a panier
    @PostMapping("/{panierId}/add")
    public Panier addToPanier(@PathVariable Long panierId,
                              @RequestBody List<Reservation> reservations) {
        return panierService.addToPanier(panierId, reservations);
    }

    // 3. Validate panier
    @PostMapping("/{panierId}/validate")
    public Panier validatePanier(@PathVariable Long panierId) {
        return panierService.validatePanier(panierId);
    }

    // ✅ 4. Modify panier contents using @RequestBody
    @PutMapping("/{panierId}/modify")
    public Panier modifyPanier(@PathVariable Long panierId,
                               @RequestBody ModifyPanierRequest request) {
        return panierService.modifyPanier(panierId, request.getToAdd(), request.getToRemove());
    }

    // 5. Cancel panier
    @DeleteMapping("/{panierId}")
    public void cancelPanier(@PathVariable Long panierId) {
        panierService.cancelPanier(panierId);
    }

    // 6. Get current panier for a participant
    @GetMapping("/participant/{participantId}/current")
    public Panier getCurrentPanier(@PathVariable Long participantId) {
        return panierService.getCurrentPanier(participantId);
    }
}
