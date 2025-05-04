package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.model.*;

public interface NotificationService {
    void sendConfirmationNotification(Participant participant, Reservation reservation);
    void sendCancellationNotification(Organizer organizer, Reservation reservation, String reason);

    void sendAdminCancellationNotification(Participant participant, Reservation reservation, String reason);
    void sendNewMessageNotification(User recipient, User sender);
}