package org.smartshop.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.smartshop.dto.Validation.Creation;
import org.smartshop.enums.CustomerTier;
import org.smartshop.enums.UserRole;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @NotBlank(groups = Creation.class, message = "Le nom d'utilisateur est obligatoire")
    private String username;

    @NotBlank(groups = Creation.class, message = "Le mot de passe est obligatoire lors de la création")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @NotBlank(message = "Le nom est obligatoire")
    private String name;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email doit être valide")
    private String email;

    private UserRole role = UserRole.CLIENT;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private CustomerTier tier;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Integer totalOrders;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private BigDecimal totalSpent;
}
