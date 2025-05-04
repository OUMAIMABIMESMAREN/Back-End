package com.oumaimabimesmaren.studentsystem.mapper;

import com.oumaimabimesmaren.studentsystem.dto.PublicationResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Publication;

public class PublicationMapper {
    public static PublicationResponseDTO toDTO(Publication publication) {
        PublicationResponseDTO dto = new PublicationResponseDTO();
        dto.setId(publication.getId());
        dto.setContent(publication.getContent());
        dto.setPublicationDate(publication.getPublicationDate());
        dto.setLikeCount(publication.getLikeCount());
        dto.setOrganizerId(publication.getOrganizer().getId());
        dto.setOrganizerName(publication.getOrganizer().getF_name() + " " + publication.getOrganizer().getL_name());
        dto.setEventId(publication.getEvent().getId());
        dto.setEventTitle(publication.getEvent().getTitle());
        return dto;
    }
}
