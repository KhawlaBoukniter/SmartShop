package org.smartshop.service;

import org.smartshop.dto.PaymentDTO;

import java.util.List;

public interface PaymentService {
    PaymentDTO addPayment(Long orderId, PaymentDTO paymentDTO);
    PaymentDTO validatePayment(Long paymentId);
    PaymentDTO rejectPayment(Long paymentId);
    List<PaymentDTO> getPaymentsByOrderId(Long orderId);
}
