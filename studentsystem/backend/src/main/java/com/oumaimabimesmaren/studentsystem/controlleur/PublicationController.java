package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.dto.ApiResponse;
import com.oumaimabimesmaren.studentsystem.dto.EventResponseDTO;
import com.oumaimabimesmaren.studentsystem.dto.PublicationDTO;
import com.oumaimabimesmaren.studentsystem.dto.PublicationResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Publication;
import com.oumaimabimesmaren.studentsystem.service.PublicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/publications")
public class PublicationController {

        @Autowired private PublicationService publicationService;

        @PostMapping("/create")
        public PublicationResponseDTO createPublication(@RequestBody PublicationDTO dto) {
            return publicationService.createPublication(dto);
        }

        @PutMapping("/{publicationId}/update")
        public PublicationResponseDTO updatePublication(@PathVariable Long publicationId,
                                                        @RequestBody String newContent) {
            return publicationService.updatePublication(publicationId, newContent);
        }

        @DeleteMapping("/{publicationId}/delete")
        public ResponseEntity<String> deletePublication(@PathVariable Long publicationId) {
            publicationService.deletePublication(publicationId);
            return ResponseEntity.ok("Post Deleted Successfully");
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

        @GetMapping("/All")
        public List<PublicationResponseDTO> getAllPublications() {
            return publicationService.getAllPublications();
        }
}

