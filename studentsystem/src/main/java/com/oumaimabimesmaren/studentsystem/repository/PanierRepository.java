package com.oumaimabimesmaren.studentsystem.repository;

import com.oumaimabimesmaren.studentsystem.model.Panier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PanierRepository extends JpaRepository<Panier, Long> {
    List<Panier> findByParticipantId(Long participantId);
    List<Panier> findByIsValidatedTrue();
    List<Panier> findByParticipantIdAndIsValidatedFalse(Long participantId);
}