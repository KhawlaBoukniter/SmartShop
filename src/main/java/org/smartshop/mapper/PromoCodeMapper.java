package org.smartshop.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.smartshop.dto.PromoCodeDTO;
import org.smartshop.entity.PromoCode;

@Mapper(componentModel = "spring")
public interface PromoCodeMapper {
    @Mapping(target = "id", source = "id")
    PromoCodeDTO toDTO(PromoCode promoCode);
    PromoCode toEntity(PromoCodeDTO promoCodeDTO);
}
