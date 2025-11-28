package org.smartshop.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.smartshop.dto.CommandeDTO;
import org.smartshop.enums.OrderStatus;
import org.smartshop.service.CommandeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Validated
public class CommandeController {

    private final CommandeService commandeService;

    @PostMapping
    public ResponseEntity<CommandeDTO> createOrder(@Valid @RequestBody CommandeDTO commandeDTO) {
        return new ResponseEntity<>(commandeService.createOrder(commandeDTO), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommandeDTO> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(commandeService.getOrder(id));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<CommandeDTO>> getClientOrders(@PathVariable Long clientId) {
        return ResponseEntity.ok(commandeService.getClientOrders(clientId));
    }

    @PatchMapping("/{id}/confirm")
    public ResponseEntity<Void> confirmOrder(@PathVariable Long id) {
        commandeService.updateStatus(id, OrderStatus.CONFIRMED);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long id) {
        commandeService.updateStatus(id, OrderStatus.CANCELED);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<CommandeDTO>> getOrdersByClient(HttpSession session) {
        Long clientId = (Long) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");
        if (clientId == null || !"CLIENT".equals(role)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(commandeService.getOrdersByClient(clientId));
    }
}
