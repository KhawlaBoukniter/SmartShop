package org.smartshop.mapper;

import org.mapstruct.Mapper;
import org.smartshop.dto.ClientDTO;
import org.smartshop.entity.Client;

@Mapper(componentModel = "spring")
public interface ClientMapper {
    ClientDTO toDTO(Client client);

    Client toEntity(ClientDTO clientDTO);
}
