package com.oumaimabimesmaren.studentsystem.repository;

import com.oumaimabimesmaren.studentsystem.model.Paiement;
import com.oumaimabimesmaren.studentsystem.model.Panier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Long> {
    List<Paiement> findByPanierParticipantId(Long participantId);
    boolean existsByPanier(Panier panier);
    List<Paiement> findByStatus(Paiement.PaymentStatus status);
    @Query("SELECT COALESCE(SUM(p.amount), 0) " +
            "FROM Paiement p " +
            "JOIN p.panier pa " +
            "JOIN pa.reservations r " +
            "WHERE r.event.organizer.id = :organizerId")
    Double sumRevenueByOrganizerId(@Param("organizerId") Long organizerId);


}


/*
Create Payment:
POST /api/paiements?panierId=123&paymentMethod=CREDIT_CARD

Process Payment (after gateway processing):
POST /api/paiements/456/process?transactionId=txn_789

Get Payment History:
GET /api/paiements/participant/789
*/