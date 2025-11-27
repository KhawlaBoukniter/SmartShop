package org.smartshop.service;

import org.smartshop.dto.CommandeDTO;
import org.smartshop.enums.OrderStatus;

import java.util.List;

public interface CommandeService {
    CommandeDTO createOrder(CommandeDTO commandeDTO);
    CommandeDTO getOrder(Long id);
    List<CommandeDTO> getClientOrders(Long clientId);
    void updateStatus(Long orderId, OrderStatus newStatus);
}
