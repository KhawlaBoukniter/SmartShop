package org.smartshop.controller;

import lombok.RequiredArgsConstructor;
import org.smartshop.dto.PromoCodeDTO;
import org.smartshop.service.PromoCodeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/promo-codes")
@RequiredArgsConstructor
public class PromoCodeController {

    private final PromoCodeService promoCodeService;

    @PostMapping("/generate")
    public ResponseEntity<PromoCodeDTO> generateOne() {
        return ResponseEntity.ok(promoCodeService.generateUniqueCode());
    }
}
