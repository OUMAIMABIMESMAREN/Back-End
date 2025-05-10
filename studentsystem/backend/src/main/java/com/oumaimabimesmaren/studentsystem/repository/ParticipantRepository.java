package com.oumaimabimesmaren.studentsystem.repository;
import com.oumaimabimesmaren.studentsystem.dto.ParticipantDTO;
import com.oumaimabimesmaren.studentsystem.model.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;



import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {

    List<Participant> findByEventId(Long eventId);
    @Query("SELECT COUNT(DISTINCT r.participant.id) FROM Reservation r WHERE r.event.organizer.id = :organizerId")
    int countDistinctParticipantsByOrganizerId(@Param("organizerId") Long organizerId);

    Optional<Participant> findByEmail(String email);


}