package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.dto.PublicationDTO;
import com.oumaimabimesmaren.studentsystem.dto.PublicationResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Publication;
import java.util.List;

public interface PublicationService {
    PublicationResponseDTO createPublication(PublicationDTO dto);
    PublicationResponseDTO updatePublication(Long publicationId, String newContent);
    void deletePublication(Long publicationId);
    PublicationResponseDTO likePublication(Long publicationId);
    List<PublicationResponseDTO> getPublicationsByOrganizer(Long organizerId);
    List<PublicationResponseDTO> getPublicationsByEvent(Long eventId);
    List<PublicationResponseDTO> getAllPublications();
}