package com.oumaimabimesmaren.studentsystem.added.controlleur;

import com.oumaimabimesmaren.studentsystem.added.dto.FilterDTO;
import com.oumaimabimesmaren.studentsystem.added.service.FilterService;
import com.oumaimabimesmaren.studentsystem.dto.EventDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/filters")
public class FilterController {

    @Autowired
    private FilterService filterService;

    @PostMapping("/events")
    public ResponseEntity<Page<EventDTO>> filterEvents(@RequestBody FilterDTO filterDTO) {
        return ResponseEntity.ok(filterService.filterEvents(filterDTO));
    }

    @GetMapping("/events/search")
    public ResponseEntity<Page<EventDTO>> searchEvents(
            @RequestParam String searchTerm,
            @RequestBody FilterDTO filterDTO) {
        return ResponseEntity.ok(filterService.searchEvents(searchTerm, filterDTO));
    }

    @GetMapping("/events/category/{category}")
    public ResponseEntity<Page<EventDTO>> filterByCategory(
            @PathVariable String category,
            @RequestBody FilterDTO filterDTO) {
        return ResponseEntity.ok(filterService.filterByCategory(category, filterDTO));
    }

    @GetMapping("/events/location/{location}")
    public ResponseEntity<Page<EventDTO>> filterByLocation(
            @PathVariable String location,
            @RequestBody FilterDTO filterDTO) {
        return ResponseEntity.ok(filterService.filterByLocation(location, filterDTO));
    }

    @GetMapping("/events/price/{price}")
    public ResponseEntity<Page<EventDTO>> filterByPrice(
            @PathVariable String price,
            @RequestBody FilterDTO filterDTO) {
        return ResponseEntity.ok(filterService.filterByPrice(price, filterDTO));
    }
} 