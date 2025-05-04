package com.oumaimabimesmaren.studentsystem.dto;

public class CancellationResult {

    private Long reservationId;
    private Double penaltyApplied;
    private Boolean eligibleForRefund;

    public Long getReservationId() {
        return reservationId;
    }

    // Constructor with all fields
    public CancellationResult(Long reservationId, Double penaltyApplied, Boolean eligibleForRefund) {
        this.reservationId = reservationId;
        this.penaltyApplied = penaltyApplied;
        this.eligibleForRefund = eligibleForRefund;
    }
    public Boolean getEligibleForRefund() {
        return eligibleForRefund;
    }

    public void setEligibleForRefund(Boolean eligibleForRefund) {
        this.eligibleForRefund = eligibleForRefund;
    }

    public Double getPenaltyApplied() {
        return penaltyApplied;
    }

    public void setPenaltyApplied(Double penaltyApplied) {
        this.penaltyApplied = penaltyApplied;
    }

    public void setReservationId(Long reservationId) {
        this.reservationId = reservationId;
    }
}
