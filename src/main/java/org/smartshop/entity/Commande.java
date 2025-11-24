package org.smartshop.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.smartshop.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "client_id",  nullable = false)
    private Client client;

    private LocalDateTime date;
    private BigDecimal subTotal;
    private BigDecimal remise;
    private BigDecimal tva;
    private BigDecimal total;
    private String promoCode;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private BigDecimal montantRestant;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL)
    private List<Payment> payments;
}
