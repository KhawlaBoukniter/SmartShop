package org.smartshop.service;

import org.smartshop.dto.ClientDTO;

import java.util.List;

public interface ClientService {
    ClientDTO createClient(ClientDTO clientDTO);
    ClientDTO updateClient(ClientDTO clientDTO);
    void deleteClient(Long id);
    ClientDTO getClient(Long id);
    List<ClientDTO> getAllClients();
}
