package org.smartshop.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.smartshop.dto.ProductDTO;
import org.smartshop.entity.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "price", source = "price")
    ProductDTO toDTO(Product product);

    @Mapping(target = "price", source = "price")
    Product toEntity(ProductDTO productDTO);
}
