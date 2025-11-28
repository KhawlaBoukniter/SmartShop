package org.smartshop.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.smartshop.dto.PaymentDTO;
import org.smartshop.entity.Payment;
import org.smartshop.enums.PaymentType;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    @Mapping(source = "commande.id", target = "commandeId")
    @Mapping(target = "paymentType", source = "paymentType")
    @Mapping(target = "paymentStatus", source = "paymentStatus")
    PaymentDTO toDTO(Payment payment);

    @Mapping(target = "commande", ignore = true)
    @Mapping(target = "paymentType", source = "paymentType")
    @Mapping(target = "paymentStatus", source = "paymentStatus")
    Payment toEntity(PaymentDTO paymentDTO);

}
