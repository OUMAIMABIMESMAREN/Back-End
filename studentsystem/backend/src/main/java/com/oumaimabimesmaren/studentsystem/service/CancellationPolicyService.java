package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.model.Event;
import com.oumaimabimesmaren.studentsystem.model.Reservation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

@Service
public class CancellationPolicyService {

    @Value("${cancellation.free_period_days:7}")
    private int freeCancellationPeriodDays;

    @Value("${cancellation.penalty.percentage:20}")
    private int penaltyPercentage;

    public void applyCancellationPolicy(Reservation reservation, Event event) {
        // Set deadline (e.g., 7 days before event)
        LocalDate deadline = event.getEventDate()
                .toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate()
                .minusDays(freeCancellationPeriodDays);

        reservation.setCancellationDeadline(Date.from(deadline.atStartOfDay(ZoneId.systemDefault()).toInstant()));

        // Auto-select policy based on event price
        if (event.getPrice() == 0) {
            reservation.setCancellationPolicy(Reservation.CancellationPolicy.FREE_CANCELLATION);
        } else if (event.getPrice() > 100) {
            reservation.setCancellationPolicy(Reservation.CancellationPolicy.REFUNDABLE);
            reservation.setPenaltyAmount(event.getPrice() * (penaltyPercentage / 100.0));
        } else {
            reservation.setCancellationPolicy(Reservation.CancellationPolicy.NON_REFUNDABLE);
        }
    }

}