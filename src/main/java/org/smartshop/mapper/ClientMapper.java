package org.smartshop.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.smartshop.dto.ClientDTO;
import org.smartshop.entity.Client;

@Mapper(componentModel = "spring")
public interface ClientMapper {
    @Mapping(target = "username", source = "user.username")
    @Mapping(target = "role", source = "user.role")
    ClientDTO toDTO(Client client);

    @Mapping(target = "user", ignore = true)
    Client toEntity(ClientDTO clientDTO);
}
