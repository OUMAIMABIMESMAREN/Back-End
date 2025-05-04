package com.oumaimabimesmaren.studentsystem.repository;

import com.oumaimabimesmaren.studentsystem.model.Organizer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrganizerRepository extends JpaRepository<Organizer, Long> {
    @Query("SELECT o FROM Organizer o WHERE (o.f_name LIKE %:name% OR o.l_name LIKE %:name%) AND o.ville = :location")
    List<Organizer> searchByNameAndLocation(@Param("name") String name, @Param("location") String location);


    @Query("SELECT o FROM Organizer o WHERE CONCAT(o.f_name, ' ', o.l_name) LIKE %:name% AND o.ville = :location AND o.rating >= :rating")
    List<Organizer> findByNameContainingAndLocationAndRatingGreaterThanEqual(
            @Param("name") String name,
            @Param("location") String location,
            @Param("rating") Double rating
    );
}