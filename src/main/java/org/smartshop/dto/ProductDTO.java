package org.smartshop.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.smartshop.dto.Validation.Creation;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @NotBlank(groups = Creation.class, message = "Le nom du produit est obligatoire")
    private String name;

    @NotNull(groups = Creation.class, message = "Le prix est obligatoire")
    private BigDecimal price;

    @NotNull(groups = Creation.class, message = "Le stock est obligatoire")
    private Integer stock;
}
