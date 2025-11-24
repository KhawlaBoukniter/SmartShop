package org.smartshop.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.smartshop.enums.PaymentStatus;
import org.smartshop.enums.PaymentType;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id")
    private Commande commande;

    private Integer number;
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    private PaymentType paymentType;
    private LocalDate datePayment;
    private LocalDate dateReceipt;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;
    private String reference;
    private String bank;
    private LocalDate deadline;
}
