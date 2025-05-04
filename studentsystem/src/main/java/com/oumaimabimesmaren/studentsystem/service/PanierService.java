package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.model.Panier;
import com.oumaimabimesmaren.studentsystem.model.Reservation;
import java.util.List;

public interface PanierService {
    Panier createPanier(Long participantId);
    Panier addToPanier(Long panierId, List<Reservation> reservations);
    Panier validatePanier(Long panierId);
    Panier modifyPanier(Long panierId, List<Reservation> toAdd, List<Long> toRemove);
    void cancelPanier(Long panierId);
    Panier getCurrentPanier(Long participantId);
}