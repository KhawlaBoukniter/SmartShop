package org.smartshop.service;

import org.junit.jupiter.api.*;
import org.mockito.*;
import org.smartshop.dto.PaymentDTO;
import org.smartshop.entity.Commande;
import org.smartshop.entity.Payment;
import org.smartshop.enums.*;
import org.smartshop.exception.BusinessException;
import org.smartshop.mapper.PaymentMapper;
import org.smartshop.repository.CommandeRepository;
import org.smartshop.repository.PaymentRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PaymentServiceImplTest {

    @Mock PaymentRepository paymentRepo;
    @Mock CommandeRepository commandeRepo;
    @Mock PaymentMapper mapper;

    @InjectMocks PaymentServiceImpl service;

    Commande commande;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        commande = new Commande();
        commande.setId(1L);
        commande.setStatus(OrderStatus.PENDING);
        commande.setMontantRestant(new BigDecimal("50000.00"));
        commande.setPayments(new ArrayList<>());

        when(commandeRepo.findById(1L)).thenReturn(java.util.Optional.of(commande));
        when(paymentRepo.save(any())).thenAnswer(i -> i.getArgument(0));
        when(mapper.toEntity(any())).thenReturn(new Payment());
    }

    @Test
    @DisplayName("Espèces ≤ 20000 → ENCAISSE auto + montantRestant diminué")
    void especesValideAutoEncaisse() {
        PaymentDTO dto = new PaymentDTO();
        dto.setAmount(new BigDecimal("15000"));
        dto.setPaymentType(PaymentType.ESPECES);
        dto.setReference("RECU-123456");
        dto.setDatePayment(LocalDate.now());

        service.addPayment(1L, dto);

        verify(paymentRepo).save(argThat(p -> p.getPaymentStatus() == PaymentStatus.ENCAISSE));
        assertEquals(new BigDecimal("35000.00"), commande.getMontantRestant());
    }

    @Test
    @DisplayName("Espèces > 20000 → refusé")
    void especesTropEleveRefuse() {
        PaymentDTO dto = new PaymentDTO();
        dto.setAmount(new BigDecimal("25000"));
        dto.setPaymentType(PaymentType.ESPECES);

        BusinessException ex = assertThrows(BusinessException.class, () -> service.addPayment(1L, dto));
        assertTrue(ex.getMessage().contains("20 000"));
    }

    @Test
    @DisplayName("Chèque → EN_ATTENTE (pas de diminution)")
    void chequeEnAttente() {
        PaymentDTO dto = new PaymentDTO();
        dto.setAmount(new BigDecimal("20000"));
        dto.setPaymentType(PaymentType.CHEQUE);
        dto.setReference("CHQ-789123");
        dto.setBank("BMCI");
        dto.setDeadline(LocalDate.now().plusDays(30));

        service.addPayment(1L, dto);

        verify(paymentRepo).save(argThat(p -> p.getPaymentStatus() == PaymentStatus.EN_ATTENTE));
        assertEquals(new BigDecimal("50000.00"), commande.getMontantRestant());
    }

    @Test
    @DisplayName("Rejet paiement déjà encaissé impossible")
    void rejetPaiementEncaisseImpossible() {
        Payment p = new Payment();
        p.setId(1L);
        p.setPaymentStatus(PaymentStatus.ENCAISSE);
        when(paymentRepo.findById(1L)).thenReturn(Optional.of(p));

        BusinessException ex = assertThrows(BusinessException.class, () -> service.rejectPayment(1L));
        assertTrue(ex.getMessage().contains("déjà encaissé"));
    }
}