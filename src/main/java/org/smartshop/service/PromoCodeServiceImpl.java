package org.smartshop.service;

import lombok.RequiredArgsConstructor;
import org.smartshop.dto.PromoCodeDTO;
import org.smartshop.entity.PromoCode;
import org.smartshop.mapper.PromoCodeMapper;
import org.smartshop.repository.PromoCodeRepository;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class PromoCodeServiceImpl implements PromoCodeService {

    private final PromoCodeRepository promoCodeRepository;
    private final PromoCodeMapper promoCodeMapper;
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    public PromoCodeDTO generateUniqueCode() {
        String code;
        do {
            code = "PROMO-" + generateRandomCode();
        } while (promoCodeRepository.existsByPromoCode(code));

        PromoCode promo = new PromoCode();
        promo.setPromoCode(code);
        promo.setUsed(false);
        return promoCodeMapper.toDTO(promoCodeRepository.save(promo));
    }

    private String generateRandomCode() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 4; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }
}