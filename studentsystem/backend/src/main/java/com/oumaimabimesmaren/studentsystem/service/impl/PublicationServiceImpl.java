package com.oumaimabimesmaren.studentsystem.service.impl;

import com.oumaimabimesmaren.studentsystem.dto.PublicationResponseDTO;
import com.oumaimabimesmaren.studentsystem.mapper.PublicationMapper;
import com.oumaimabimesmaren.studentsystem.model.*;
import com.oumaimabimesmaren.studentsystem.repository.*;
import com.oumaimabimesmaren.studentsystem.service.PublicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import com.oumaimabimesmaren.studentsystem.dto.PublicationDTO;

@Service
public class PublicationServiceImpl implements PublicationService {

    @Autowired private PublicationRepository publicationRepository;
    @Autowired private OrganizerRepository organizerRepository;
    @Autowired private EventRepository eventRepository;

    @Override
    @Transactional
    public PublicationResponseDTO createPublication(PublicationDTO dto) {
        Organizer organizer = organizerRepository.findById(dto.getOrganizerId())
                .orElseThrow(() -> new RuntimeException("Organizer not found"));
        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Publication publication = new Publication();
        publication.setOrganizer(organizer);
        publication.setEvent(event);
        publication.setContent(dto.getContent());

        return PublicationMapper.toDTO(publicationRepository.save(publication));
    }

    @Override
    @Transactional
    public PublicationResponseDTO updatePublication(Long publicationId, String newContent) {
        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new RuntimeException("Publication not found"));
        publication.setContent(newContent);
        return PublicationMapper.toDTO(publicationRepository.save(publication));
    }

    @Override
    @Transactional
    public PublicationResponseDTO likePublication(Long publicationId) {
        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new RuntimeException("Publication not found"));
        publication.incrementLikes();
        return PublicationMapper.toDTO(publicationRepository.save(publication));
    }

    @Override
    public List<PublicationResponseDTO> getPublicationsByOrganizer(Long organizerId) {
        return publicationRepository.findByOrganizerId(organizerId)
                .stream().map(PublicationMapper::toDTO).toList();
    }

    @Override
    public List<PublicationResponseDTO> getPublicationsByEvent(Long eventId) {
        return publicationRepository.findByEventId(eventId)
                .stream().map(PublicationMapper::toDTO).toList();
    }

    @Override
    public List<PublicationResponseDTO> getAllPublications() {
        return publicationRepository.findByOrderByPublicationDateDesc()
                .stream().map(PublicationMapper::toDTO).toList();
    }

    @Override
    @Transactional
    public void deletePublication(Long publicationId) {
        publicationRepository.deleteById(publicationId);
    }

}