package com.oumaimabimesmaren.studentsystem.added.service.impl;

import com.oumaimabimesmaren.studentsystem.added.dto.FilterDTO;
import com.oumaimabimesmaren.studentsystem.added.service.FilterService;
import com.oumaimabimesmaren.studentsystem.dto.EventDTO;
import com.oumaimabimesmaren.studentsystem.mapper.EventMapper;
import com.oumaimabimesmaren.studentsystem.model.Event;
import com.oumaimabimesmaren.studentsystem.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FilterServiceImpl implements FilterService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventMapper eventMapper;

    @Override
    public Page<EventDTO> filterEvents(FilterDTO filterDTO) {
        Pageable pageable = createPageable(filterDTO);
        Page<Event> events = eventRepository.findAll(pageable);
        return events.map(EventMapper::toDTO);
    }

    @Override
    public Page<EventDTO> searchEvents(String searchTerm, FilterDTO filterDTO) {
        Pageable pageable = createPageable(filterDTO);
        Page<Event> events = eventRepository.findByTitleContainingOrDescriptionContaining(
            searchTerm, searchTerm, pageable);
        return events.map(EventMapper::toDTO);
    }

    @Override
    public Page<EventDTO> filterByCategory(String category, FilterDTO filterDTO) {
        Pageable pageable = createPageable(filterDTO);
        Page<Event> events = eventRepository.findByCategory(category, pageable);
        return events.map(EventMapper::toDTO);
    }

    @Override
    public Page<EventDTO> filterByLocation(String location, FilterDTO filterDTO) {
        Pageable pageable = createPageable(filterDTO);
        Page<Event> events = eventRepository.findByLieu(location, pageable);
        return events.map(EventMapper::toDTO);
    }

    @Override
    public Page<EventDTO> filterByPrice(String price, FilterDTO filterDTO) {
        Pageable pageable = createPageable(filterDTO);
        Page<Event> events;
        
        if ("free".equalsIgnoreCase(price)) {
            events = eventRepository.findByPrice(0.0, pageable);
        } else if ("paid".equalsIgnoreCase(price)) {
            events = eventRepository.findByPriceGreaterThan(0.0, pageable);
        } else {
            events = eventRepository.findAll(pageable);
        }
        
        return events.map(EventMapper::toDTO);
    }

    private Pageable createPageable(FilterDTO filterDTO) {
        int page = filterDTO.getPage() != null ? filterDTO.getPage() : 0;
        int size = filterDTO.getSize() != null ? filterDTO.getSize() : 10;
        
        if (filterDTO.getSortBy() != null && filterDTO.getSortOrder() != null) {
            Sort.Direction direction = Sort.Direction.fromString(filterDTO.getSortOrder().toUpperCase());
            return PageRequest.of(page, size, Sort.by(direction, filterDTO.getSortBy()));
        }
        
        return PageRequest.of(page, size);
    }
} 