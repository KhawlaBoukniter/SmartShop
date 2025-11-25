package org.smartshop.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.smartshop.enums.UserRole;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;
    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role;
}
