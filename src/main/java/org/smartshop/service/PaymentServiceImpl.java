package org.smartshop.service;

import lombok.RequiredArgsConstructor;
import org.smartshop.dto.PaymentDTO;
import org.smartshop.entity.Commande;
import org.smartshop.entity.Payment;
import org.smartshop.enums.OrderStatus;
import org.smartshop.enums.PaymentStatus;
import org.smartshop.enums.PaymentType;
import org.smartshop.exception.BusinessException;
import org.smartshop.exception.ResourceNotFoundException;
import org.smartshop.mapper.PaymentMapper;
import org.smartshop.repository.CommandeRepository;
import org.smartshop.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

        private final PaymentRepository paymentRepository;
        private final CommandeRepository commandeRepository;
        private final PaymentMapper paymentMapper;

        public PaymentDTO addPayment(Long orderId, PaymentDTO paymentDTO) {
            Commande commande = commandeRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée avec id: " + orderId));

            if (commande.getStatus() != OrderStatus.PENDING) {
                throw new BusinessException("Impossible d'ajouter un paiement à une commande non en attente");
            }

            BigDecimal amount = paymentDTO.getAmount();

            if (paymentDTO.getPaymentType().equals(PaymentType.ESPECES) && amount.compareTo(new BigDecimal("20000")) > 0) {
                throw new BusinessException("Montant du paiement dépasse la limite légale de 20 000 DH");
            }

            if (amount.compareTo(commande.getMontantRestant()) > 0) {
                throw new BusinessException("Le montant du paiement dépasse le montant restant dû");
            }

            Payment payment = paymentMapper.toEntity(paymentDTO);
            payment.setCommande(commande);
            payment.setNumber(commande.getPayments().size() + 1);
            payment.setDatePayment(LocalDate.now());

            if (PaymentType.ESPECES.equals(paymentDTO.getPaymentType())) {
                payment.setPaymentType(PaymentType.ESPECES);
                payment.setPaymentStatus(PaymentStatus.ENCAISSE);
                payment.setDateReceipt(LocalDate.now());
            } else {
                payment.setPaymentType(paymentDTO.getPaymentType());
                payment.setPaymentStatus(PaymentStatus.EN_ATTENTE);
                payment.setDateReceipt(null);
            }

            paymentRepository.save(payment);

            commande.setMontantRestant(commande.getMontantRestant().subtract(amount));
            commandeRepository.save(commande);

            return paymentMapper.toDTO(payment);
        }

        public PaymentDTO validatePayment(Long paymentId) {
            Payment payment = paymentRepository.findById(paymentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Paiement non trouvé avec id: " + paymentId));

            if (payment.getPaymentStatus() == PaymentStatus.ENCAISSE) {
                throw new BusinessException("Ce paiement est déjà encaissé");
            }

            if (payment.getPaymentStatus() == PaymentStatus.REJETE) {
                throw new BusinessException("Ce paiement a été rejeté");
            }

            payment.setPaymentStatus(PaymentStatus.ENCAISSE);
            payment.setDateReceipt(LocalDate.now());

            return paymentMapper.toDTO(paymentRepository.save(payment));
        }

    public PaymentDTO rejectPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Paiement non trouvé avec id: " + paymentId));

        if (payment.getPaymentStatus() == PaymentStatus.ENCAISSE) {
            throw new BusinessException("Impossible de rejeter un paiement déjà encaissé");
        }

        payment.setPaymentStatus(PaymentStatus.REJETE);
        paymentRepository.save(payment);

        Commande commande = payment.getCommande();
        commande.setMontantRestant(commande.getMontantRestant().add(payment.getAmount()));
        commandeRepository.save(commande);

        return paymentMapper.toDTO(payment);
    }

    public List<PaymentDTO> getPaymentsByOrderId(Long orderId) {
        return paymentRepository.findByCommande_IdOrderByNumber(orderId).stream()
                .map(paymentMapper::toDTO)
                .toList();
    }

}
