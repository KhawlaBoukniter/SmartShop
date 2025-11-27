package org.smartshop.mapper;

import org.mapstruct.Mapper;
import org.smartshop.dto.PromoCodeDTO;
import org.smartshop.entity.PromoCode;

@Mapper(componentModel = "spring")
public interface PromoCodeMapper {
    PromoCodeDTO toDTO(PromoCode promoCode);
    PromoCode toEntity(PromoCodeDTO promoCodeDTO);
}
