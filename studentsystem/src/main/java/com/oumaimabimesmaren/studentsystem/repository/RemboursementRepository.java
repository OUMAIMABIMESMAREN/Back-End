package com.oumaimabimesmaren.studentsystem.repository;

import com.oumaimabimesmaren.studentsystem.model.Remboursement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RemboursementRepository extends JpaRepository<Remboursement, Long> {
    List<Remboursement> findByStatus(String status);
    @Query("SELECT r FROM Remboursement r WHERE r.participant.id = :participantId AND r.event.id = :eventId")
    Optional<Remboursement> findByParticipantIdAndEventId(@Param("participantId") Long participantId,
                                                          @Param("eventId") Long eventId);

    @Query("SELECT COUNT(r) FROM Remboursement r WHERE r.event.organizer.id = :organizerId AND r.status = 'PENDING'")
    int countPendingByOrganizerId(@Param("organizerId") Long organizerId);

    List<Remboursement> findByEvent_Organizer_Id(Long organizerId);
    Optional<Remboursement> findByEvent_IdAndParticipant_Id(Long eventId, Long participantId);




}
