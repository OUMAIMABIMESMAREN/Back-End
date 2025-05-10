package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.dto.*;
import com.oumaimabimesmaren.studentsystem.model.*;

public interface AdminService {
    UserResponseDTO addUser(User user);
    void deleteUser(Long userId);
    OrganizerResponseDTO reviewOrganizerAccount(Long organizerId, boolean isApproved,  Long adminId);
    ValidationEventResponseDTO validateEventModifications(Long eventId, boolean isValidated , Long adminId);
    void deleteEvent(Long eventId);
    ValidationEventResponseDTO validateNewEvent(Long eventId, boolean isValidated, Long adminId);
    void handleCancellationNotification(Long eventId, String reason);

    AdminResponseDTO createAdmin(AdminDTO adminDTO);
    AdminResponseDTO updateAdmin(Long id, AdminDTO adminDTO);
}