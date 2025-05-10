package com.oumaimabimesmaren.studentsystem.repository;

import com.oumaimabimesmaren.studentsystem.model.Publication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PublicationRepository extends JpaRepository<Publication, Long> {
    List<Publication> findByOrganizerId(Long organizerId);
    List<Publication> findByEventId(Long eventId);
    List<Publication> findByOrderByPublicationDateDesc();

    @Query("SELECT COUNT(pub) FROM Publication pub WHERE pub.organizer.id = :organizerId")
    int countByOrganizerId(@Param("organizerId") Long organizerId);

}