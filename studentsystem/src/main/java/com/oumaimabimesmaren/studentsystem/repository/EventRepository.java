package com.oumaimabimesmaren.studentsystem.repository;

import com.oumaimabimesmaren.studentsystem.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> , EventRepositoryCustom{
    List<Event> findByOrganizerId(Long organizerId);
    List<Event> findByEventDateAfter(Date date);
    @Query("SELECT COUNT(e) FROM Event e WHERE e.organizer.id = :organizerId")
    int countByOrganizerId(@Param("organizerId") Long organizerId);

    @Query("SELECT SUM(e.price * e.capacity) FROM Event e WHERE e.organizer.id = :organizerId")
    Double sumRevenueByOrganizerId(@Param("organizerId") Long organizerId);

    @Query("SELECT e FROM Event e WHERE e.organizer.id = :organizerId AND e.eventDate > CURRENT_DATE")
    List<Event> findUpcomingEventsByOrganizerId(@Param("organizerId") Long organizerId);

    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END " +
            "FROM Event e WHERE e.id = :eventId AND e.organizer.id = :organizerId")
    boolean existsByIdAndOrganizerId(
            @Param("eventId") Long eventId,
            @Param("organizerId") Long organizerId);


    List<Event> findByTitleContainingAndLieu(String title, String lieu);
    List<Event> findByTitleContainingAndLieuAndEventDateBetween(String title, String lieu,
                                                           LocalDate startDate, LocalDate endDate);
    List<Event> findByParticipants_Id(Long participantId);




}