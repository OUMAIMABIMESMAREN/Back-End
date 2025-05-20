package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.dto.PaiementResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Paiement;
import com.oumaimabimesmaren.studentsystem.service.PaiementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/paiements")
public class PaiementController {

    @Autowired
    private PaiementService paiementService;

    @PostMapping("/{panierId}/create")
    public PaiementResponseDTO createPaiement(
            @PathVariable Long panierId,
            @RequestParam Paiement.PaymentMethod paymentMethod) {
        Paiement paiement = paiementService.createPaiement(panierId, paymentMethod);
        return new PaiementResponseDTO(paiement);
    }

    @PostMapping("/{id}/process")
    public PaiementResponseDTO processPayment(
            @PathVariable Long id,
            @RequestParam String transactionId) {
        Paiement paiement = paiementService.processPayment(id, transactionId);
        return new PaiementResponseDTO(paiement);
    }

    @GetMapping("/{id}/get")
    public PaiementResponseDTO getPaiement(@PathVariable Long id) {
        return new PaiementResponseDTO(paiementService.getPaiementById(id));
    }

    @GetMapping("/participant/{participantId}/get")
    public List<PaiementResponseDTO> getParticipantPaiements(@PathVariable Long participantId) {
        return paiementService.getPaiementsByParticipant(participantId)
                .stream()
                .map(PaiementResponseDTO::new)
                .collect(Collectors.toList());
    }

    @PostMapping("/{id}/refund")
    public PaiementResponseDTO refundPaiement(@PathVariable Long id) {
        Paiement paiement = paiementService.refundPaiement(id);
        return new PaiementResponseDTO(paiement);
    }
}
