package com.oumaimabimesmaren.studentsystem.service.impl;

import com.oumaimabimesmaren.studentsystem.model.*;
import com.oumaimabimesmaren.studentsystem.repository.PaiementRepository;
import com.oumaimabimesmaren.studentsystem.repository.PanierRepository;
import com.oumaimabimesmaren.studentsystem.service.PaiementService;
import com.oumaimabimesmaren.studentsystem.util.StripeSimulator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class PaiementServiceImpl implements PaiementService {

    @Autowired
    private PaiementRepository paiementRepository;

    @Autowired
    private PanierRepository panierRepository;

    @Override
    @Transactional
    public Paiement createPaiement(Long panierId, Paiement.PaymentMethod paymentMethod) {
        Panier panier = panierRepository.findById(panierId)
                .orElseThrow(() -> new RuntimeException("Panier not found"));

        if (!panier.getIsValidated()) {
            throw new IllegalStateException("Panier must be validated before payment");
        }

        if (paiementRepository.existsByPanier(panier)) {
            throw new IllegalStateException("Payment already exists for this panier");
        }

        Paiement paiement = new Paiement(panier, paymentMethod);
        return paiementRepository.save(paiement);
    }

    @Override
    @Transactional
    public Paiement processPayment(Long paiementId, String transactionId) {
        Paiement paiement = paiementRepository.findById(paiementId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        String simulatedTransactionId = StripeSimulator.charge(paiement.getAmount(), "DH", "dummy-token");
        paiement.setTransactionId(simulatedTransactionId);
        paiement.setStatus(Paiement.PaymentStatus.COMPLETED);
        paiement.setPaymentDate(new Date());

        // Also mark the panier as paid (optional: add a new field for isPaid)
        paiement.getPanier().setIsPaid(true);
        // In real implementation, integrate with payment gateway here
        return paiementRepository.save(paiement);
    }

    @Override
    public Paiement getPaiementById(Long id) {
        return paiementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    @Override
    public List<Paiement> getPaiementsByParticipant(Long participantId) {
        return paiementRepository.findByPanierParticipantId(participantId);
    }

    @Override
    @Transactional
    public Paiement refundPaiement(Long paiementId) {
        Paiement paiement = paiementRepository.findById(paiementId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        paiement.setStatus(Paiement.PaymentStatus.REFUNDED);

        // In real implementation, process refund with payment provider
        System.out.println("Processing refund of " + paiement.getAmount() + " via " +
                paiement.getPaymentMethod());

        return paiementRepository.save(paiement);
    }
}