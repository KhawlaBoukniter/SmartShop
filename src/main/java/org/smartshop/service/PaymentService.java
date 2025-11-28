package org.smartshop.service;

import org.smartshop.dto.PaymentDTO;

public interface PaymentService {
    PaymentDTO addPayment(Long orderId, PaymentDTO paymentDTO);
    PaymentDTO validatePayment(Long paymentId);
    PaymentDTO rejectPayment(Long paymentId);
}
