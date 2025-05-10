package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.model.Paiement;
import com.oumaimabimesmaren.studentsystem.model.Panier;
import java.util.List;

public interface PaiementService {
    Paiement createPaiement(Long panierId, Paiement.PaymentMethod paymentMethod);
    Paiement processPayment(Long paiementId, String transactionId);
    Paiement getPaiementById(Long id);
    List<Paiement> getPaiementsByParticipant(Long participantId);
    Paiement refundPaiement(Long paiementId);
}