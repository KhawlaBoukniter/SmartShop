package org.smartshop.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.smartshop.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommandeDTO {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @NotNull(message = "L'ID du client est obligatoire")
    private Long clientId;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime date;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @PositiveOrZero(message = "Le sous-total doit être positif ou zéro")
    private BigDecimal subTotal;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @PositiveOrZero(message = "La remise doit être positive ou zéro")
    private BigDecimal remise;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private BigDecimal tva;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private BigDecimal total;

    @Pattern(regexp = "^$|^PROMO-[A-Z0-9]{4}$", message = "Code promo invalide (format attendu : PROMO-XXXX ou vide)")
    private String promoCode;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private OrderStatus status;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private BigDecimal montantRestant;

    @NotEmpty(message = "La commande doit contenir au moins un article")
    private List<@Valid OrderItemDTO> items;
    private List<@Valid PaymentDTO> payments;
}
