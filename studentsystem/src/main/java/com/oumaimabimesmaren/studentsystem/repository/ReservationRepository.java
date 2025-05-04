package com.oumaimabimesmaren.studentsystem.repository;

import com.oumaimabimesmaren.studentsystem.model.Participant;
import com.oumaimabimesmaren.studentsystem.model.Remboursement;
import com.oumaimabimesmaren.studentsystem.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByParticipantId(Long participantId);
    List<Reservation> findByEventId(Long eventId);
    int countByEventId(Long eventId);
    @Query("SELECT r.participant FROM Reservation r WHERE r.event.id = :eventId")
    List<Participant> findParticipantsByEventId(@Param("eventId") Long eventId);

    @Query("SELECT r FROM Reservation r WHERE r.event.id = :eventId AND r.participant.id = :participantId")
    Optional<Reservation> findByEventIdAndParticipantId(@Param("eventId") Long eventId,
                                                        @Param("participantId") Long participantId);

    @Query("SELECT r FROM Remboursement r WHERE r.participant.id = :participantId AND r.event.id = :eventId")
    Optional<Remboursement> findByParticipantIdAndEventId(@Param("participantId") Long participantId,
                                                          @Param("eventId") Long eventId);


}