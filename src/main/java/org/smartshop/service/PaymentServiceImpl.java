package org.smartshop.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
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

            switch (paymentDTO.getPaymentType()) {
                case ESPECES:
                    if (paymentDTO.getReference() == null || !paymentDTO.getReference().startsWith("RECU-")) {
                        throw new BusinessException("Référence obligatoire au format RECU-XXX pour espèces");
                    }
                    payment.setPaymentStatus(PaymentStatus.ENCAISSE);
                    payment.setDateReceipt(LocalDate.now());
                    commande.setMontantRestant(commande.getMontantRestant().subtract(amount));
                    break;
                case CHEQUE:
                    if (paymentDTO.getReference() == null || !paymentDTO.getReference().startsWith("CHQ-") ||
                            paymentDTO.getBank() == null || paymentDTO.getDeadline() == null ||
                            paymentDTO.getDeadline().isBefore(LocalDate.now().plusDays(1))) {
                        throw new BusinessException("Pour chèque : référence CHQ-XXX, banque, et échéance future obligatoires");
                    }
                    payment.setPaymentStatus(PaymentStatus.EN_ATTENTE);
                    break;
                case VIREMENT:
                    if (paymentDTO.getReference() == null || !paymentDTO.getReference().startsWith("VIR-") ||
                            paymentDTO.getBank() == null) {
                        throw new BusinessException("Pour virement : référence VIR-XXX et banque obligatoires");
                    }
                    payment.setPaymentStatus(PaymentStatus.EN_ATTENTE);
                    break;
            }

            paymentRepository.save(payment);
            log.info("PAIEMENT CRÉÉ | Commande: {} | Montant: {} DH | Moyen: {} | Statut: {} | Réf: {}",
                    orderId, amount, paymentDTO.getPaymentType(), payment.getPaymentStatus(), payment.getReference());
            commande.getPayments().add(payment);
            if (payment.getPaymentStatus() == PaymentStatus.ENCAISSE) {
                commande.setMontantRestant(commande.getMontantRestant().subtract(amount));
            }
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
            paymentRepository.save(payment);

            log.info("PAIEMENT VALIDÉ | Paiement ID: {} | Commande: {} | Montant: {} DH | Date encaissement: {}",
                    paymentId, payment.getCommande().getId(), payment.getAmount(), LocalDate.now());

            Commande commande = payment.getCommande();
            commande.setMontantRestant(commande.getMontantRestant().subtract(payment.getAmount()).setScale(2, RoundingMode.HALF_UP));
            commandeRepository.save(commande);

            return paymentMapper.toDTO(payment);
        }

    public PaymentDTO rejectPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Paiement non trouvé avec id: " + paymentId));

        if (payment.getPaymentStatus() == PaymentStatus.ENCAISSE) {
            throw new BusinessException("Impossible de rejeter un paiement déjà encaissé");
        }

        payment.setPaymentStatus(PaymentStatus.REJETE);
        paymentRepository.save(payment);

        log.info("PAIEMENT REJETÉ | Paiement ID: {} | Commande: {} | Montant: {} DH | Raison: Rejet admin",
                paymentId, payment.getCommande().getId(), payment.getAmount());

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
