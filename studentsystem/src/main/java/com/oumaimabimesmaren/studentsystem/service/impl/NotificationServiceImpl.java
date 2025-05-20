package com.oumaimabimesmaren.studentsystem.service.impl;

import com.oumaimabimesmaren.studentsystem.model.*;
import com.oumaimabimesmaren.studentsystem.service.NotificationService;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Override
    public void sendConfirmationNotification(Participant participant, Reservation reservation) {
        String message = String.format(
                "Dear %s, your reservation for %s is confirmed. Reservation ID: %d",
                participant.getF_name(),
                reservation.getEvent().getTitle(),
                reservation.getId()
        );

        // In real implementation, integrate with email/SMS service
        System.out.println("Sending notification to " + participant.getEmail());
        System.out.println("Message: " + message);
    }

    @Override
    public void sendCancellationNotification(Organizer organizer, Reservation reservation, String reason) {
        String message = String.format(
                "Organizer alert: Reservation %d for %s was cancelled. Reason: %s",
                reservation.getId(),
                reservation.getEvent().getTitle(),
                reason
        );

        System.out.println("Sending cancellation notice to " + organizer.getEmail());
        System.out.println("Message: " + message);
    }

    @Override
    public void sendAdminCancellationNotification(Participant participant,
                                                  Reservation reservation,
                                                  String reason) {
        // 1. Build both HTML and plain text versions
        String htmlContent = buildAdminCancellationEmail(reservation, reason);
        String plainText = buildAdminCancellationText(reservation, reason);

        // 2. Log for debugging (remove in production)
        logNotification("ADMIN_CANCELLATION", participant.getEmail(), plainText);

        // 3. Actual email sending (uncomment when ready)
    /*
    try {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(participant.getEmail());
        helper.setSubject("Reservation Cancellation Notice");
        helper.setText(plainText, htmlContent);
        mailSender.send(message);
        log.info("Admin cancellation email sent to {}", participant.getEmail());
    } catch (Exception e) {
        log.error("Failed to send admin cancellation email", e);
    }
    */
    }

    // Helper method for HTML email
    private String buildAdminCancellationEmail(Reservation reservation, String reason) {
        return String.format("""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #d9534f;">Reservation Cancellation Notice</h2>
                    <p>Dear %s %s,</p>
                    <p>Your reservation for <strong>%s</strong> has been cancelled by administration.</p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #d9534f;">
                        <p><strong>Reason:</strong> %s</p>
                        <p><strong>Refund amount:</strong> $%.2f</p>
                        <p><strong>Reservation ID:</strong> %d</p>
                        <p><strong>Event Date:</strong> %s</p>
                    </div>
                    <p>If you believe this was done in error, please contact our support team.</p>
                </div>
            </body>
        </html>
        """,
                reservation.getParticipant().getF_name(),
                reservation.getParticipant().getL_name(),
                reservation.getEvent().getTitle(),
                reason,
                reservation.getEvent().getPrice(),
                reservation.getId(),
                reservation.getEvent().getEventDate()
        );
    }

    // Helper method for plain text email
    private String buildAdminCancellationText(Reservation reservation, String reason) {
        return String.format(
                "ADMIN CANCELLATION NOTICE\n\n" +
                        "Dear %s %s,\n\n" +
                        "Your reservation for %s (ID: %d) was cancelled by admin.\n" +
                        "Reason: %s\n" +
                        "Refund amount: $%.2f\n" +
                        "Event Date: %s\n\n" +
                        "If you believe this was done in error, please contact our support team.",
                reservation.getParticipant().getF_name(),
                reservation.getParticipant().getL_name(),
                reservation.getEvent().getTitle(),
                reservation.getId(),
                reason,
                reservation.getEvent().getPrice(),
                reservation.getEvent().getEventDate()
        );
    }

    // General notification logger
    private void logNotification(String type, String recipient, String content) {
        System.out.printf("\n--- NOTIFICATION (%s) ---\nTo: %s\nContent:\n%s\n",
                type, recipient, content);
    }

    @Override
    public void sendNewMessageNotification(User recipient, User sender) {
        // Implementation example:
        String notificationMessage = String.format("New message from %s", sender.getEmail());
        System.out.println(notificationMessage); // Replace with actual notification logic
        // Could save to database, send email, push notification, etc.
    }
}