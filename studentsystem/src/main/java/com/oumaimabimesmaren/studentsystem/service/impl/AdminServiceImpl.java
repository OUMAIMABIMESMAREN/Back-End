package com.oumaimabimesmaren.studentsystem.service.impl;

import com.oumaimabimesmaren.studentsystem.dto.AdminDTO;
import com.oumaimabimesmaren.studentsystem.dto.AdminResponseDTO;
import com.oumaimabimesmaren.studentsystem.dto.UserRequestDTO;
import com.oumaimabimesmaren.studentsystem.dto.UserResponseDTO;
import com.oumaimabimesmaren.studentsystem.exception.ResourceNotFoundException;
import com.oumaimabimesmaren.studentsystem.mapper.UserMapper;
import com.oumaimabimesmaren.studentsystem.model.*;
import com.oumaimabimesmaren.studentsystem.repository.*;
import com.oumaimabimesmaren.studentsystem.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {
    private final AdminRepository adminRepository;

    @Autowired
    public AdminServiceImpl(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }
    @Autowired private UserRepository userRepository;
    @Autowired private OrganizerRepository organizerRepository;
    @Autowired private EventRepository eventRepository;
    private static final Logger logger = LoggerFactory.getLogger(AdminServiceImpl.class);

    @Override
    public UserResponseDTO addUser(User user) {
        User savedUser = userRepository.save(user);
        return UserMapper.toResponseDTO(savedUser);
    }

    @Override
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    @Override
    public Organizer reviewOrganizerAccount(Long organizerId, boolean isApproved) {
        Organizer organizer = organizerRepository.findById(organizerId)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer not found"));
        organizer.setApproved(isApproved); // Changed from setStatus to setApproved
        return organizerRepository.save(organizer);
    }

    @Override
    public Event validateEventModifications(Long eventId, boolean isValidated, Long adminId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));


        event.setValidated(isValidated);
        event.setValidatedBy(admin);
        event.setValidationDate(LocalDateTime.now());
        event.setStatus("ACTIVE");
        event.setValidationStatus("VALIDATED");

        return eventRepository.save(event);
    }

    @Override
    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }

    @Override
    public Event validateNewEvent(Long eventId, boolean isValidated) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        event.setValidated(isValidated); // Note: This might need to match your Event model
        return eventRepository.save(event);
    }

    @Override
    public void handleCancellationNotification(Long eventId, String reason) {
        logger.info("Event {} was cancelled. Reason: {}", eventId, reason);
    }

    @Override
    public AdminResponseDTO createAdmin(AdminDTO adminDTO) {
        Admin admin = new Admin();
        admin.setF_name(adminDTO.getF_name());
        admin.setL_name(adminDTO.getL_name());
        admin.setEmail(adminDTO.getEmail());
        admin.setPassword(adminDTO.getPassword());
        admin.setAddress(adminDTO.getAddress());
        admin.setBirthDate(adminDTO.getBirthDate());
        admin.setVille(adminDTO.getVille());
        admin.setPhone_num(adminDTO.getPhone_num());
        admin.setRole(adminDTO.getRole());

        // Fetch approved organizers
        if (adminDTO.getApprovedOrganizerIds() != null) {
            List<Organizer> organizers = organizerRepository.findAllById(adminDTO.getApprovedOrganizerIds());
            admin.setApprovedOrganizers(organizers);
        }

        // Fetch validated events
        if (adminDTO.getValidatedEventIds() != null) {
            List<Event> events = eventRepository.findAllById(adminDTO.getValidatedEventIds());
            admin.setValidatedEvents(events);
        }

        Admin savedAdmin = adminRepository.save(admin);

        return new AdminResponseDTO(
                savedAdmin.getId(),
                savedAdmin.getF_name(),
                savedAdmin.getL_name(),
                savedAdmin.getEmail()
        );
    }

    @Override
    @Transactional
    public AdminResponseDTO updateAdmin(Long id, AdminDTO adminDTO) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + id));

        // Update only the fields that are provided
        if (adminDTO.getF_name() != null) {
            admin.setF_name(adminDTO.getF_name());
        }
        if (adminDTO.getL_name() != null) {
            admin.setL_name(adminDTO.getL_name());
        }
        if (adminDTO.getEmail() != null) {
            admin.setEmail(adminDTO.getEmail());
        }
        if (adminDTO.getPassword() != null) {
            admin.setPassword(adminDTO.getPassword());
        }
        if (adminDTO.getAddress() != null) {
            admin.setAddress(adminDTO.getAddress());
        }
        if (adminDTO.getBirthDate() != null) {
            admin.setBirthDate(adminDTO.getBirthDate());
        }
        if (adminDTO.getVille() != null) {
            admin.setVille(adminDTO.getVille());
        }
        if (adminDTO.getPhone_num() != null) {
            admin.setPhone_num(adminDTO.getPhone_num());
        }
        if (adminDTO.getRole() != null) {
            admin.setRole(adminDTO.getRole());
        }
        if (adminDTO.getProfilPic() != null) {
            admin.setProfilPic(adminDTO.getProfilPic());
        }

        if (adminDTO.getApprovedOrganizerIds() != null) {
            List<Organizer> organizers = organizerRepository.findAllById(adminDTO.getApprovedOrganizerIds());
            admin.setApprovedOrganizers(organizers);
        }

        if (adminDTO.getValidatedEventIds() != null) {
            List<Event> events = eventRepository.findAllById(adminDTO.getValidatedEventIds());
            admin.setValidatedEvents(events);
        }

        Admin updatedAdmin = adminRepository.save(admin);

        return new AdminResponseDTO(
                updatedAdmin.getId(),
                updatedAdmin.getF_name(),
                updatedAdmin.getL_name(),
                updatedAdmin.getEmail()
        );
    }

}