package org.smartshop.controller;

import lombok.RequiredArgsConstructor;
import org.smartshop.dto.PaymentDTO;
import org.smartshop.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/order/{orderId}")
    public ResponseEntity<PaymentDTO> addPayment(@PathVariable Long orderId, @RequestBody PaymentDTO paymentDTO) {
        return new ResponseEntity<>(paymentService.addPayment(orderId, paymentDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/validate")
    public ResponseEntity<PaymentDTO> validatePayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.validatePayment(id));
    }
}
