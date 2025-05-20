package com.oumaimabimesmaren.studentsystem.repository;

import com.oumaimabimesmaren.studentsystem.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long>, EventRepositoryCustom {
    List<Event> findByOrganizerId(Long organizerId);
    List<Event> findByEventDateAfter(Date date);
    List<Event> findByEventDateAfterAndStatusNot(Date date, String status);

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

    @Query("SELECT e FROM Event e WHERE " +
           "(:title IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:category IS NULL OR e.category = :category) AND " +
           "(:fromDate IS NULL OR e.eventDate >= :fromDate) AND " +
           "(:toDate IS NULL OR e.eventDate <= :toDate) AND " +
           "(:minPrice IS NULL OR e.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR e.price <= :maxPrice) AND " +
           "(:location IS NULL OR LOWER(e.lieu) LIKE LOWER(CONCAT('%', :location, '%')))")
    List<Event> searchEvents(
            @Param("title") String title,
            @Param("category") String category,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("location") String location);

    Page<Event> findByTitleContainingOrDescriptionContaining(String title, String description, Pageable pageable);
    Page<Event> findByCategory(String category, Pageable pageable);
    Page<Event> findByLieu(String location, Pageable pageable);
    Page<Event> findByPrice(Double price, Pageable pageable);
    Page<Event> findByPriceGreaterThan(Double price, Pageable pageable);
}