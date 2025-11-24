package org.smartshop.mapper;

import org.mapstruct.Mapper;
import org.smartshop.dto.PaymentDTO;
import org.smartshop.entity.Payment;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    PaymentDTO toDTO(Payment payment);

    Payment toEntity(PaymentDTO paymentDTO);

}
