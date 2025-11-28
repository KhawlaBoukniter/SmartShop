package org.smartshop.repository;

import org.smartshop.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByDeleted(Boolean deleted, Pageable pageable);

    Page<Product> findByDeletedAndNameContainingIgnoreCase(Boolean deleted, String name, Pageable pageable);
}
