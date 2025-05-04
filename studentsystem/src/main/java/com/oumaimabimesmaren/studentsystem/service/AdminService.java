package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.dto.AdminDTO;
import com.oumaimabimesmaren.studentsystem.dto.AdminResponseDTO;
import com.oumaimabimesmaren.studentsystem.dto.UserResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.*;

public interface AdminService {
    UserResponseDTO addUser(User user);
    void deleteUser(Long userId);
    Organizer reviewOrganizerAccount(Long organizerId, boolean isApproved);
    Event validateEventModifications(Long eventId, boolean isValidated , Long adminId);
    void deleteEvent(Long eventId);
    Event validateNewEvent(Long eventId, boolean isValidated);
    void handleCancellationNotification(Long eventId, String reason);

    AdminResponseDTO createAdmin(AdminDTO adminDTO);
    AdminResponseDTO updateAdmin(Long id, AdminDTO adminDTO);
}