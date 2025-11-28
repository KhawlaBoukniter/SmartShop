package org.smartshop.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromoCodeDTO {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @NotBlank(message = "Le code promo est obligatoire")
    @Pattern(regexp = "^PROMO-[A-Z0-9]{4}$", message = "Format invalide. Doit être au format PROMO-XXXX (ex: PROMO-AB12)")
    private String promoCode;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private boolean used = false;
}
