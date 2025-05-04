package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.dto.PublicationDTO;
import com.oumaimabimesmaren.studentsystem.dto.PublicationResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Publication;
import com.oumaimabimesmaren.studentsystem.service.PublicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/publications")
public class PublicationController {

        @Autowired private PublicationService publicationService;

        @PostMapping
        public PublicationResponseDTO createPublication(@RequestBody PublicationDTO dto) {
            return publicationService.createPublication(dto);
        }

        @PutMapping("/{publicationId}")
        public PublicationResponseDTO updatePublication(@PathVariable Long publicationId,
                                                        @RequestBody String newContent) {
            return publicationService.updatePublication(publicationId, newContent);
        }

        @DeleteMapping("/{publicationId}")
        public void deletePublication(@PathVariable Long publicationId) {
            publicationService.deletePublication(publicationId);
        }

        @PostMapping("/{publicationId}/like")
        public PublicationResponseDTO likePublication(@PathVariable Long publicationId) {
            return publicationService.likePublication(publicationId);
        }

        @GetMapping("/organizer/{organizerId}")
        public List<PublicationResponseDTO> getByOrganizer(@PathVariable Long organizerId) {
            return publicationService.getPublicationsByOrganizer(organizerId);
        }

        @GetMapping("/event/{eventId}")
        public List<PublicationResponseDTO> getByEvent(@PathVariable Long eventId) {
            return publicationService.getPublicationsByEvent(eventId);
        }

        @GetMapping
        public List<PublicationResponseDTO> getAllPublications() {
            return publicationService.getAllPublications();
        }
}

