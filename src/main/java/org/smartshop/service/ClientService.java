package org.smartshop.service;

import org.smartshop.dto.ClientDTO;
import org.smartshop.entity.Client;
import org.smartshop.enums.CustomerTier;

import java.math.BigDecimal;
import java.util.List;

public interface ClientService {
    ClientDTO createClient(ClientDTO clientDTO);
    ClientDTO updateClient(Long id, ClientDTO clientDTO);
    void deleteClient(Long id);
    ClientDTO getClient(Long id);
    List<ClientDTO> getAllClients();
    void updateClientStats(Long id, BigDecimal orderAmount);
    BigDecimal calculateLoyaltyDiscount(CustomerTier tier, BigDecimal subTotal);
}
