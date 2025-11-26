package org.smartshop.service;

import org.smartshop.dto.ClientDTO;
import org.smartshop.entity.Client;
import org.smartshop.enums.CustomerTier;
import org.smartshop.exception.ResourceNotFoundException;
import org.smartshop.mapper.ClientMapper;
import org.smartshop.repository.ClientRepository;
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
        Client client = clientMapper.toEntity(clientDTO);
        client.setPassword(BCrypt.hashpw(client.getPassword(), BCrypt.gensalt()));
        client.setTier(CustomerTier.BASIC);
        client.setTotalOrders(0);
        client.setTotalSpent(BigDecimal.ZERO);
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

}
