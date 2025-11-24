package org.smartshop.mapper;

import org.mapstruct.Mapper;
import org.smartshop.dto.ProductDTO;
import org.smartshop.entity.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductDTO toDTO(Product product);

    Product toEntity(ProductDTO productDTO);
}
