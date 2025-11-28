package org.smartshop.service;

import org.smartshop.dto.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    ProductDTO createProduct(ProductDTO productDTO);
    ProductDTO getProduct(Long id);
    Page<ProductDTO> getAllProducts(String name, Pageable pageable);
    ProductDTO updateProduct(Long id, ProductDTO productDTO);
    void deleteProduct(Long id);
}
