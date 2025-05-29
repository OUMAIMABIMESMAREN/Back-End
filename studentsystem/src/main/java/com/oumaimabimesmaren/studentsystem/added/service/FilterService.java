package com.oumaimabimesmaren.studentsystem.added.service;

import com.oumaimabimesmaren.studentsystem.added.dto.FilterDTO;
import com.oumaimabimesmaren.studentsystem.dto.EventDTO;
import org.springframework.data.domain.Page;

public interface FilterService {
    Page<EventDTO> filterEvents(FilterDTO filterDTO);
    Page<EventDTO> searchEvents(String searchTerm, FilterDTO filterDTO);
    Page<EventDTO> filterByCategory(String category, FilterDTO filterDTO);
    Page<EventDTO> filterByLocation(String location, FilterDTO filterDTO);
    Page<EventDTO> filterByPrice(String price, FilterDTO filterDTO);
} 