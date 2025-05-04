package com.oumaimabimesmaren.studentsystem.service.impl;

import com.oumaimabimesmaren.studentsystem.model.*;
import com.oumaimabimesmaren.studentsystem.repository.*;
import com.oumaimabimesmaren.studentsystem.service.PanierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class PanierServiceImpl implements PanierService {

    @Autowired
    private PanierRepository panierRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Override
    @Transactional
    public Panier createPanier(Long participantId) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Participant not found"));

        // Check for existing active panier
        List<Panier> activePaniers = panierRepository.findByParticipantIdAndIsValidatedFalse(participantId);
        if (!activePaniers.isEmpty()) {
            return activePaniers.get(0);
        }

        Panier panier = new Panier(participant);
        return panierRepository.save(panier);
    }

    @Override
    @Transactional
    public Panier addToPanier(Long panierId, List<Reservation> reservations) {
        Panier panier = panierRepository.findById(panierId)
                .orElseThrow(() -> new RuntimeException("Panier not found"));

        if (panier.getIsValidated()) {
            throw new IllegalStateException("Cannot add to validated panier");
        }

        panier.addReservations(reservations);
        return panierRepository.save(panier);
    }

    @Override
    @Transactional
    public Panier validatePanier(Long panierId) {
        Panier panier = panierRepository.findById(panierId)
                .orElseThrow(() -> new RuntimeException("Panier not found"));

        panier.validatePanier();
        return panierRepository.save(panier);
    }

    @Override
    @Transactional
    public Panier modifyPanier(Long panierId, List<Reservation> toAdd, List<Long> toRemove) {
        Panier panier = panierRepository.findById(panierId)
                .orElseThrow(() -> new RuntimeException("Panier not found"));

        // Avoid null pointer exceptions
        if (toAdd == null) {
            toAdd = List.of(); // empty list
        }
        if (toRemove == null) {
            toRemove = List.of();
        }

        toAdd = reservationRepository.saveAll(toAdd);
        panier.modifyPanier(toAdd, toRemove);
        return panierRepository.save(panier);
    }

    @Override
    @Transactional
    public void cancelPanier(Long panierId) {
        Panier panier = panierRepository.findById(panierId)
                .orElseThrow(() -> new RuntimeException("Panier not found"));

        panier.cancelPanier();
        panierRepository.save(panier);
    }

    @Override
    public Panier getCurrentPanier(Long participantId) {
        List<Panier> activePaniers = panierRepository.findByParticipantIdAndIsValidatedFalse(participantId);
        return activePaniers.isEmpty() ? null : activePaniers.get(0);
    }
}