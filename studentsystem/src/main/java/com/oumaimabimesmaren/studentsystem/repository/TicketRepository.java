package com.oumaimabimesmaren.studentsystem.repository;

import com.oumaimabimesmaren.studentsystem.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByReservationId(Long reservationId);
    List<Ticket> findByReservationParticipantId(Long participantId);
    List<Ticket> findByReservationEventId(Long eventId);
    @Query("SELECT COUNT(t) FROM Ticket t " +
            "JOIN t.reservation r " +
            "JOIN r.event e " +
            "WHERE e.organizer.id = :organizerId")
    int countTicketsByOrganizerId(@Param("organizerId") Long organizerId);



}