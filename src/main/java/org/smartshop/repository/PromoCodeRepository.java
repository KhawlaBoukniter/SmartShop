package org.smartshop.repository;

import org.smartshop.entity.PromoCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PromoCodeRepository extends JpaRepository<PromoCode, Long> {
    Optional<PromoCode> findByCodeAndUsedFalse(String code);
    Boolean existsByCode(String code);
}
