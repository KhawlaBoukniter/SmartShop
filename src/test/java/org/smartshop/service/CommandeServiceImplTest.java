package org.smartshop.service;

import org.junit.jupiter.api.*;
import org.mockito.*;
import org.smartshop.dto.CommandeDTO;
import org.smartshop.dto.OrderItemDTO;
import org.smartshop.entity.*;
import org.smartshop.enums.CustomerTier;
import org.smartshop.enums.OrderStatus;
import org.smartshop.exception.ResourceNotFoundException;
import org.smartshop.mapper.CommandeMapper;
import org.smartshop.repository.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CommandeServiceImplTest {

    @Mock private CommandeRepository commandeRepo;
    @Mock private ClientRepository clientRepo;
    @Mock private ProductRepository productRepo;
    @Mock private PromoCodeRepository promoCodeRepo;
    @Mock private ClientService clientService;
    @Mock private CommandeMapper mapper;

    @InjectMocks private CommandeServiceImpl commandeService;

    private Client client;
    private Product produitEnStock;
    private Product produitHorsStock;
    private PromoCode promoCode;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        org.springframework.test.util.ReflectionTestUtils.setField(
                commandeService,
                "tvaRate",
                new BigDecimal("0.2")
        );

        client = new Client();
        client.setId(1L);
        client.setTier(CustomerTier.SILVER);

        produitEnStock = Product.builder()
                .id(1L)
                .name("PC Portable")
                .price(new BigDecimal("12000.00"))
                .stock(10)
                .deleted(false)
                .build();

        produitHorsStock = Product.builder()
                .id(2L)
                .name("Écran")
                .price(new BigDecimal("5000.00"))
                .stock(1)
                .deleted(false)
                .build();

        promoCode = new PromoCode();
        promoCode.setId(1L);
        promoCode.setPromoCode("PROMO-AB12");
        promoCode.setUsed(false);

        when(clientRepo.findById(1L)).thenReturn(Optional.of(client));
        when(productRepo.findById(1L)).thenReturn(Optional.of(produitEnStock));
        when(productRepo.findById(2L)).thenReturn(Optional.of(produitHorsStock));
        when(promoCodeRepo.findByPromoCodeAndUsedFalse("PROMO-AB12"))
                .thenReturn(Optional.of(promoCode));

        when(mapper.toEntity(any(CommandeDTO.class))).thenReturn(new Commande());

        when(mapper.toDTO(any(Commande.class))).thenAnswer(inv -> {
            Commande c = inv.getArgument(0);
            CommandeDTO dto = new CommandeDTO();

            dto.setId(c.getId());
            dto.setStatus(c.getStatus());
            dto.setRemise(c.getRemise());
            dto.setTotal(c.getTotal());
            dto.setSubTotal(c.getSubTotal());
            dto.setMontantRestant(c.getMontantRestant());
            dto.setTva(c.getTva());

            return dto;
        });

        when(clientService.calculateLoyaltyDiscount(eq(CustomerTier.SILVER), any(BigDecimal.class)))
                .thenReturn(new BigDecimal("600.00"));

        when(commandeRepo.save(any(Commande.class))).thenAnswer(inv -> {
            Commande c = inv.getArgument(0);
            c.setId(100L);
            c.setDate(LocalDateTime.now());
            return c;
        });
    }

    @Test
    @DisplayName("Commande REJECTED si stock insuffisant")
    void commandeRejeteeSiStockInsuffisant() {
        OrderItemDTO item = OrderItemDTO.builder()
                .productId(2L)
                .quantity(5)
                .build();

        CommandeDTO dto = new CommandeDTO();
        dto.setClientId(1L);
        dto.setItems(List.of(item));

        CommandeDTO result = commandeService.createOrder(dto);

        assertEquals(OrderStatus.REJECTED, result.getStatus());
    }

    @Test
    void commandePendingSiStockOk() {
        OrderItemDTO item = OrderItemDTO.builder()
                .productId(1L)
                .quantity(2)
                .build();

        CommandeDTO dto = new CommandeDTO();
        dto.setClientId(1L);
        dto.setItems(List.of(item));

        CommandeDTO result = commandeService.createOrder(dto);

        assertEquals(OrderStatus.PENDING, result.getStatus());
    }

    @Test
    void remiseFideliteAppliquee() {
        OrderItemDTO item = OrderItemDTO.builder()
                .productId(1L)
                .quantity(1)
                .build();

        CommandeDTO dto = new CommandeDTO();
        dto.setClientId(1L);
        dto.setItems(List.of(item));

        commandeService.createOrder(dto);

        verify(clientService).calculateLoyaltyDiscount(eq(CustomerTier.SILVER), any(BigDecimal.class));
    }

    @Test
    void codePromoApplique() {
        OrderItemDTO item = OrderItemDTO.builder()
                .productId(1L)
                .quantity(1)
                .build();

        CommandeDTO dto = new CommandeDTO();
        dto.setClientId(1L);
        dto.setPromoCode("PROMO-AB12");
        dto.setItems(List.of(item));

        commandeService.createOrder(dto);

        assertTrue(promoCode.isUsed());
    }

    @Test
    @DisplayName("Exception si client inexistant")
    void exceptionSiClientInexistant() {
        when(clientRepo.findById(999L)).thenReturn(Optional.empty());

        CommandeDTO dto = new CommandeDTO();
        dto.setClientId(999L);
        dto.setItems(List.of(
                OrderItemDTO.builder().productId(1L).quantity(1).build()
        ));

        assertThrows(ResourceNotFoundException.class, () -> commandeService.createOrder(dto));
    }
}
