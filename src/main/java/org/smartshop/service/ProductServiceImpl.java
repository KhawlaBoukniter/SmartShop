package org.smartshop.service;

import lombok.RequiredArgsConstructor;
import org.smartshop.dto.ProductDTO;
import org.smartshop.entity.Product;
import org.smartshop.exception.ResourceNotFoundException;
import org.smartshop.mapper.ProductMapper;
import org.smartshop.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = productMapper.toEntity(productDTO);
        product.setDeleted(false);
        return productMapper.toDTO(productRepository.save(product));
    }

    public ProductDTO getProduct(Long id) {
        Product product = productRepository.findById(id)
                .filter(p -> !p.getDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé avec id: " + id));
        return productMapper.toDTO(product);
    }

    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        return productRepository.findByDeleted(false, pageable)
                .map(productMapper::toDTO);
    }

    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .filter(p -> !p.getDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé avec id: " + id));

        product.setName(productDTO.getName());
        product.setUnitPrice(productDTO.getPrice());
        product.setStock(productDTO.getStock());

        return productMapper.toDTO(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé avec id: " + id));

        product.setDeleted(true);
        productRepository.save(product);
    }
}
