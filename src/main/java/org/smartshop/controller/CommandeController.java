package org.smartshop.controller;

import lombok.RequiredArgsConstructor;
import org.smartshop.dto.CommandeDTO;
import org.smartshop.enums.OrderStatus;
import org.smartshop.service.CommandeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class CommandeController {

    private final CommandeService commandeService;

    @PostMapping
    public ResponseEntity<CommandeDTO> createOrder(@RequestBody CommandeDTO commandeDTO) {
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

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        commandeService.updateStatus(id, status);
        return ResponseEntity.ok().build();
    }
}
