package org.smartshop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.smartshop.enums.CustomerTier;
import org.smartshop.enums.UserRole;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {
    private String username;
    private String password;
    private String name;
    private String email;
    private UserRole role = UserRole.CLIENT;
    private CustomerTier tier;
    private Integer totalOrders;
    private BigDecimal totalSpent;
}
