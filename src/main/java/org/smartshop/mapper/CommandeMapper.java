package org.smartshop.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.smartshop.dto.CommandeDTO;
import org.smartshop.dto.OrderItemDTO;
import org.smartshop.dto.PaymentDTO;
import org.smartshop.entity.Commande;
import org.smartshop.entity.OrderItem;
import org.smartshop.entity.Payment;
import org.smartshop.entity.PromoCode;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class, PaymentMapper.class})
public interface CommandeMapper {

    @Mapping(source = "client.id", target = "clientId")
    @Mapping(target = "promoCode", source = "promoCode.promoCode")
    CommandeDTO toDTO(Commande commande);

    @Mapping(target = "promoCode", ignore = true)
    Commande toEntity(CommandeDTO commandeDTO);

    default String map(PromoCode promoCode) {
        return promoCode != null ? promoCode.getPromoCode() : null;
    }

    default PromoCode map(String promoCodeString) {
        if (promoCodeString == null || promoCodeString.isBlank()) {
            return null;
        }
        PromoCode promoCode = new PromoCode();
        promoCode.setPromoCode(promoCodeString);
        return promoCode;
    }
}
