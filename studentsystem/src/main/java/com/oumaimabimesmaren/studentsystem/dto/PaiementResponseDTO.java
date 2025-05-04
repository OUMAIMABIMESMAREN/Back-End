package com.oumaimabimesmaren.studentsystem.dto;

import com.oumaimabimesmaren.studentsystem.model.Paiement;
import java.util.Date;

public class PaiementResponseDTO {
    private Long id;
    private Double amount;
    private String paymentMethod;
    private String transactionId;
    private Date paymentDate;
    private String status;

    public PaiementResponseDTO(Paiement paiement) {
        this.id = paiement.getId();
        this.amount = paiement.getAmount();
        this.paymentMethod = paiement.getPaymentMethod().name();
        this.transactionId = paiement.getTransactionId();
        this.paymentDate = paiement.getPaymentDate();
        this.status = paiement.getStatus().name();
    }

    // Getters
    public Long getId() { return id; }
    public Double getAmount() { return amount; }
    public String getPaymentMethod() { return paymentMethod; }
    public String getTransactionId() { return transactionId; }
    public Date getPaymentDate() { return paymentDate; }
    public String getStatus() { return status; }
}
