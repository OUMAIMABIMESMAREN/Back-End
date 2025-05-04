package com.oumaimabimesmaren.studentsystem.repository;

import com.oumaimabimesmaren.studentsystem.model.Event;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class EventRepositoryImpl implements EventRepositoryCustom {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<Event> findAdvanced(
            String title,
            String category,
            Date fromDate,
            Date toDate,
            Double minPrice,
            Double maxPrice,
            String location
    ) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Event> cq = cb.createQuery(Event.class);
        Root<Event> event = cq.from(Event.class);
        List<Predicate> predicates = new ArrayList<>();

        if (title != null) {
            predicates.add(cb.like(cb.lower(event.get("title")), "%" + title.toLowerCase() + "%"));
        }
        if (category != null) {
            predicates.add(cb.equal(event.get("category"), category));
        }
        if (fromDate != null) {
            predicates.add(cb.greaterThanOrEqualTo(event.get("eventDate"), fromDate));
        }
        if (toDate != null) {
            predicates.add(cb.lessThanOrEqualTo(event.get("eventDate"), toDate));
        }
        if (minPrice != null) {
            predicates.add(cb.greaterThanOrEqualTo(event.get("price"), minPrice));
        }
        if (maxPrice != null) {
            predicates.add(cb.lessThanOrEqualTo(event.get("price"), maxPrice));
        }
        if (location != null) {
            predicates.add(cb.like(cb.lower(event.get("lieu")), "%" + location.toLowerCase() + "%"));
        }

        cq.where(predicates.toArray(new Predicate[0]));
        return em.createQuery(cq).getResultList();
    }
}