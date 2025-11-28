package org.smartshop.service;

import org.junit.jupiter.api.*;
import org.mockito.*;
import org.smartshop.dto.ProductDTO;
import org.smartshop.entity.Product;
import org.smartshop.exception.ResourceNotFoundException;
import org.smartshop.mapper.ProductMapper;
import org.smartshop.repository.ProductRepository;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceImplTest {

    @Mock ProductRepository repo;
    @Mock ProductMapper mapper;

    @InjectMocks ProductServiceImpl service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Création produit réussie")
    void creationProduitReussie() {
        ProductDTO dto = new ProductDTO();
        dto.setName("PC Test");
        dto.setPrice(new BigDecimal("10000"));
        dto.setStock(10);

        Product entity = new Product();
        when(mapper.toEntity(dto)).thenReturn(entity);
        when(repo.save(entity)).thenReturn(entity);
        when(mapper.toDTO(entity)).thenReturn(dto);

        ProductDTO result = service.createProduct(dto);

        assertNotNull(result);
        assertFalse(entity.getDeleted());
    }

    @Test
    @DisplayName("Suppression logique (soft delete)")
    void suppressionLogique() {
        Product p = new Product();
        p.setId(1L);
        p.setDeleted(false);

        when(repo.findById(1L)).thenReturn(Optional.of(p));

        service.deleteProduct(1L);

        assertTrue(p.getDeleted());
        verify(repo).save(p);
    }

    @Test
    @DisplayName("Exception si produit non trouvé")
    void exceptionProduitInexistant() {
        when(repo.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.deleteProduct(999L));
    }
}