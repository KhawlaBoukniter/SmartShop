package org.smartshop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.smartshop.enums.PaymentStatus;
import org.smartshop.enums.PaymentType;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long id;
    private Long commandeId;
    private Integer number;
    private BigDecimal amount;
    private PaymentType paymentMethod;
    private String reference;
    private LocalDate paymentDate;
    private LocalDate dateReceipt;
    private String bank;
    private LocalDate deadline;
    private PaymentStatus status;
}
