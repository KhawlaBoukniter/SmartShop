package org.smartshop.repository;

import org.smartshop.entity.PromoCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PromoCodeRepository extends JpaRepository<PromoCode, Long> {
    Boolean existsByPromoCode(String promoCode);
    Optional<PromoCode> findByPromoCodeAndUsedFalse(String promoCode);
}
