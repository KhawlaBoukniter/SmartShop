package org.smartshop.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.smartshop.enums.CustomerTier;

import java.math.BigDecimal;

@Entity
@Data
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    private CustomerTier tier;

    private Integer totalOrders;
    private BigDecimal totalSpent;
}
