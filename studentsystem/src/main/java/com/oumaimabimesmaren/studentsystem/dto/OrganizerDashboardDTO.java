package com.oumaimabimesmaren.studentsystem.dto;

import com.oumaimabimesmaren.studentsystem.model.Event;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
@Data
@AllArgsConstructor
public class OrganizerDashboardDTO {
    private String organizerName;
    private int totalEvents;
    private int totalParticipants;
    private double totalRevenue;
    private int totalTicketsSold;
    private int pendingReimbursements;
    private int totalPublications;
    private List<EventSummaryDTO> upcomingEvents;
}