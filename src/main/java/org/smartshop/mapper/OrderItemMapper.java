package org.smartshop.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.smartshop.dto.OrderItemDTO;
import org.smartshop.entity.OrderItem;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    OrderItemDTO toDTO(OrderItem orderItem);

    OrderItem toEntity(OrderItemDTO orderItemDTO);
}
