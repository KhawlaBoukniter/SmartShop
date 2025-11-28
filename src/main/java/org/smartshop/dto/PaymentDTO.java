package org.smartshop.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.smartshop.dto.Validation.Creation;
import org.smartshop.dto.Validation.Update;
import org.smartshop.enums.PaymentStatus;
import org.smartshop.enums.PaymentType;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @NotNull(groups = Creation.class, message = "L'ID de la commande est obligatoire")
    @Positive(groups = Creation.class, message = "L'ID de la commande doit être positif")
    private Long commandeId;

    private Integer number;

    @NotNull(groups = Creation.class, message = "Le montant du paiement est obligatoire")
    @PositiveOrZero(groups = Creation.class, message = "Le montant doit être positif")
    private BigDecimal amount;

    @NotNull(groups = Creation.class, message = "Le moyen de paiement est obligatoire")
    private PaymentType paymentType;

    @NotBlank(message = "La référence est obligatoire pour CHÈQUE et VIREMENT",
            groups = {Creation.class, Update.class, ChequeGroup.class, VirementGroup.class})
    @Pattern(regexp = "^(CHQ|REC| VIR)-[A-Z0-9]{6,10}$",
            message = "Référence invalide (ex: CHQ-7894561, RECU-001, VIR-2025-11111)",
            groups = {Creation.class, Update.class, ChequeGroup.class, RecuGroup.class, VirementGroup.class})
    private String reference;

    @NotNull(groups = Creation.class, message = "La date de paiement est obligatoire")
    @PastOrPresent(groups = Creation.class, message = "La date de paiement ne peut pas être future")
    private LocalDate datePayment;

    private LocalDate dateReceipt;
    private String bank;

    @Future(message = "La date d'échéance doit être dans le futur", groups = {Creation.class, Update.class, ChequeGroup.class})
    private LocalDate deadline;
    private PaymentStatus paymentStatus;

    public interface ChequeGroup {}
    public interface VirementGroup {}
    public interface RecuGroup {}
}
