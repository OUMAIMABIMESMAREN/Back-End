package com.oumaimabimesmaren.studentsystem.repository;

import com.oumaimabimesmaren.studentsystem.model.Event;
import java.util.Date;
import java.util.List;

public interface EventRepositoryCustom {
    List<Event> findAdvanced(
            String title,
            String category,
            Date fromDate,
            Date toDate,
            Double minPrice,
            Double maxPrice,
            String location
    );
}