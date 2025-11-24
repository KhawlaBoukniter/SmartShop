package org.smartshop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.smartshop.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommandeDTO {
    private Long id;
    private Long clientId;
    private LocalDateTime date;
    private BigDecimal subTotal;
    private BigDecimal remise;
    private BigDecimal tva;
    private BigDecimal total;
    private String promoCode;
    private OrderStatus status;
    private BigDecimal montantRestant;
    private List<OrderItemDTO> items;
    private List<PaymentDTO> payments;
}
