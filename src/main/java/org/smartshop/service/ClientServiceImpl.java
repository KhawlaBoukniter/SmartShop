package org.smartshop.service;

import org.smartshop.dto.ClientDTO;
import org.smartshop.entity.Client;
import org.smartshop.entity.User;
import org.smartshop.enums.CustomerTier;
import org.smartshop.enums.UserRole;
import org.smartshop.exception.ResourceNotFoundException;
import org.smartshop.mapper.ClientMapper;
import org.smartshop.repository.ClientRepository;
import org.smartshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ClientServiceImpl implements ClientService{

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;

    @Autowired
    public ClientServiceImpl(ClientRepository clientRepository, ClientMapper clientMapper) {
        this.clientRepository = clientRepository;
        this.clientMapper = clientMapper;
    }

    public ClientDTO createClient(ClientDTO clientDTO) {
        User user = new User();
        user.setUsername(clientDTO.getUsername());
        user.setPassword(BCrypt.hashpw(clientDTO.getPassword(), BCrypt.gensalt()));
        user.setRole(UserRole.CLIENT);

        Client client = new Client();
        client.setUser(user);
        client.setName(clientDTO.getName());
        client.setEmail(clientDTO.getEmail());
        client.setTotalSpent(BigDecimal.ZERO);
        client.setTotalOrders(0);
        client.setTier(CustomerTier.BASIC);

        return clientMapper.toDTO(clientRepository.save(client));
    }

    public ClientDTO updateClient(Long id, ClientDTO clientDTO) {
        Client client = clientRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Aucun client trouvé avec id : " + id));
        client.setName(clientDTO.getName());
        client.setEmail(clientDTO.getEmail());
        return clientMapper.toDTO(clientRepository.save(client));
    }

    public void deleteClient(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Aucun client trouvé avec id : " + id);
        }
        clientRepository.deleteById(id);
    }

    public ClientDTO getClient(Long id) {
        Client client = clientRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Aucun client trouvé avec id : " + id));
        return clientMapper.toDTO(client);
    }

    public List<ClientDTO> getAllClients() {

        return clientRepository.findAll().stream().map(clientMapper::toDTO).toList();
    }

    public void updateClientStats(Long id, BigDecimal orderAmount) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable"));

        client.setTotalOrders(client.getTotalOrders() + 1);
        client.setTotalSpent(client.getTotalSpent().add(orderAmount));

        CustomerTier newTier = calculateTier(client.getTotalOrders(), client.getTotalSpent());
        client.setTier(newTier);

        clientRepository.save(client);
    }

    private CustomerTier calculateTier(int totalOrders, BigDecimal totalSpent) {
        if (totalOrders >= 20 || totalSpent.compareTo(new BigDecimal("15000")) >= 0) {
            return CustomerTier.PLATINUM;
        } else if (totalOrders >= 10 || totalSpent.compareTo(new BigDecimal("5000")) >= 0) {
            return CustomerTier.GOLD;
        } else if (totalOrders >= 3 || totalSpent.compareTo(new BigDecimal("1000")) >= 0) {
            return CustomerTier.SILVER;
        }
        return CustomerTier.BASIC;
    }

    public BigDecimal calculateLoyaltyDiscount(CustomerTier tier, BigDecimal subTotal) {
        return switch (tier) {
            case SILVER -> subTotal.compareTo(new BigDecimal("500"))  >= 0 ? subTotal.multiply(new BigDecimal("0.05")) : BigDecimal.ZERO;
            case GOLD -> subTotal.compareTo(new BigDecimal("800"))  >= 0 ? subTotal.multiply(new BigDecimal("0.10")) : BigDecimal.ZERO;
            case PLATINUM -> subTotal.compareTo(new BigDecimal("1200")) >= 0 ? subTotal.multiply(new BigDecimal("0.15")) : BigDecimal.ZERO;
            default -> BigDecimal.ZERO;
        };
    }

}
