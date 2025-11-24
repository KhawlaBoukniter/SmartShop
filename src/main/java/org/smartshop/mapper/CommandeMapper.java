package org.smartshop.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.smartshop.dto.CommandeDTO;
import org.smartshop.dto.OrderItemDTO;
import org.smartshop.dto.PaymentDTO;
import org.smartshop.entity.Commande;
import org.smartshop.entity.OrderItem;
import org.smartshop.entity.Payment;

@Mapper(componentModel = "spring")
public interface CommandeMapper {

    @Mapping(source = "client.id", target = "clientId")
    CommandeDTO toDTO(Commande commande);

    Commande toEntity(CommandeDTO commandeDTO);
}
