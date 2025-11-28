package org.smartshop.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.smartshop.dto.CommandeDTO;
import org.smartshop.dto.OrderItemDTO;
import org.smartshop.entity.*;
import org.smartshop.enums.OrderStatus;
import org.smartshop.enums.PaymentStatus;
import org.smartshop.exception.BusinessException;
import org.smartshop.exception.ResourceNotFoundException;
import org.smartshop.mapper.CommandeMapper;
import org.smartshop.repository.ClientRepository;
import org.smartshop.repository.CommandeRepository;
import org.smartshop.repository.ProductRepository;
import org.smartshop.repository.PromoCodeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommandeServiceImpl implements CommandeService {

    private final CommandeRepository commandeRepository;
    private final ClientRepository clientRepository;
    private final ProductRepository productRepository;
    private final CommandeMapper commandeMapper;
    private final PromoCodeRepository promoCodeRepository;
    private final ClientService clientService;

    @Value("${app.tva.rate}")
    private BigDecimal tvaRate;

    @Transactional
    public CommandeDTO createOrder(CommandeDTO commandeDTO) {
        Client client = clientRepository.findById(commandeDTO.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec id: " + commandeDTO.getClientId()));

        Commande commande = new Commande();
        commande.setClient(client);
        commande.setDate(LocalDateTime.now());
        commande.setStatus(OrderStatus.PENDING);

        List<OrderItem> items = new ArrayList<>();
        BigDecimal subTotal = BigDecimal.ZERO;
        Boolean stockInsufficient = false;

        for (OrderItemDTO itemDTO : commandeDTO.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId()).filter(p -> !p.getDeleted())
                    .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé avec id : " + itemDTO.getProductId()));

            if (product.getStock() < itemDTO.getQuantity()) {
                stockInsufficient = true;
            }

//            if (product.getDeleted()) {
//                commande.setStatus(OrderStatus.REJECTED);
//                commande.setMontantRestant(BigDecimal.ZERO);
//                commandeRepository.save(commande);
//                throw new BusinessException("Produit supprimé: " + product.getName());
//            }
//
//            if (product.getStock() < itemDTO.getQuantity()) {
//                commande.setStatus(OrderStatus.REJECTED);
//                commande.setMontantRestant(BigDecimal.ZERO);
//                commandeRepository.save(commande);
//                throw new BusinessException("Stock insuffisant pour produit: " + product.getName());
//            }

            OrderItem item = new OrderItem();
            item.setCommande(commande);
            item.setProduct(product);
            item.setQuantity(itemDTO.getQuantity());
            item.setUnitPrice(product.getPrice());
            item.setTotal(product.getPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity())));

            items.add(item);
            subTotal = subTotal.add(item.getTotal());
        }

        commande.setItems(items);
        commande.setSubTotal(subTotal.setScale(2, RoundingMode.HALF_UP));

        BigDecimal discount = clientService.calculateLoyaltyDiscount(client.getTier(), subTotal);

        // PromoCode logic
        BigDecimal promoDiscount = BigDecimal.ZERO;
        if (commandeDTO.getPromoCode() != null && !commandeDTO.getPromoCode().isBlank()) {
            String promoCode = commandeDTO.getPromoCode().trim().toUpperCase();

            if (!promoCode.matches("^PROMO-[A-Z0-9]{4}$")) {
                throw new BusinessException("Code promo invalide. Format attendu : PROMO-XXXX");
            }

            PromoCode promo = promoCodeRepository.findByPromoCodeAndUsedFalse(promoCode)
                    .orElseThrow(() -> new BusinessException("Code promo invalide ou déjà utilisé"));

            promoDiscount = subTotal.multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP);
            promo.setUsed(true);
            promoCodeRepository.save(promo);

            commande.setPromoCode(promo);
        }

        commande.setRemise(discount.add(promoDiscount).setScale(2, RoundingMode.HALF_UP));

        BigDecimal totalHt = subTotal.subtract(discount).subtract(promoDiscount);
        if (totalHt.compareTo(BigDecimal.ZERO) < 0) totalHt = BigDecimal.ZERO;

        BigDecimal tva = totalHt.multiply(tvaRate)
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalTtc = totalHt.add(tva)
                .setScale(2, RoundingMode.HALF_UP);

        commande.setTva(tva);
        commande.setTotal(totalTtc);
        commande.setMontantRestant(totalTtc);

        if (stockInsufficient) {
            commande.setStatus(OrderStatus.REJECTED);
        }

        Commande saved = commandeRepository.save(commande);

        log.info("COMMANDE CRÉÉE | ID: {} | Client: {} | Total TTC: {} DH | Remise: {} DH | Code promo: {} | Status: {}",
                saved.getId(), client.getName(), saved.getTotal(), discount, commandeDTO.getPromoCode() != null ? commandeDTO.getPromoCode() : "aucun", commandeDTO.getStatus());

        return commandeMapper.toDTO(saved);
    }

    public CommandeDTO getOrder(Long id) {
        return commandeMapper.toDTO(commandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée")));
    }

    public List<CommandeDTO> getClientOrders(Long clientId) {
        return commandeRepository.findByClient_Id(clientId).stream()
                .map(commandeMapper::toDTO)
                .toList();
    }

    @Transactional
    public void updateStatus(Long orderId, OrderStatus newStatus) {
        Commande commande = commandeRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée"));

        if (commande.getStatus() == OrderStatus.CONFIRMED || commande.getStatus() == OrderStatus.CANCELED
                || commande.getStatus() == OrderStatus.REJECTED) {
            throw new BusinessException("Commande déjà confirmée, impossible de changer statut");
        }

        if (newStatus == OrderStatus.CANCELED && commande.getStatus() != OrderStatus.PENDING) {
            throw new BusinessException("Une commande ne peut être annulée que si elle est en attente (PENDING)");
        }

        Boolean hasPendingPayment = commande.getPayments().stream()
                .anyMatch(p -> p.getPaymentStatus() == PaymentStatus.EN_ATTENTE);
        if (hasPendingPayment) {
            throw new BusinessException("Impossible de confirmer : des paiements sont encore en attente d'encaissement");
        }

        if (newStatus == OrderStatus.CONFIRMED) {
            if (commande.getMontantRestant().compareTo(BigDecimal.ZERO) > 0) {
                throw new BusinessException("Commande ne peut pas être confirmée. Payment non complété.");
            }
            if (commande.getPayments().stream().anyMatch(p -> p.getPaymentStatus() == PaymentStatus.EN_ATTENTE)) {
                throw new BusinessException("Des paiements sont encore en attente d'encaissement");
            }
            for (OrderItem item : commande.getItems()) {
                Product p = item.getProduct();
                if (p.getStock() < item.getQuantity()) {
                    throw new BusinessException("Stock insuffisant pour " + p.getName() + " pendant la confirmation");
                }
                p.setStock(p.getStock() - item.getQuantity());
                productRepository.save(p);
            }

            clientService.updateClientStats(commande.getClient().getId(), commande.getTotal());

            log.info("COMMANDE CONFIRMÉE | ID: {} | Client: {} | Total TTC: {} DH | Stock décrémenté | Stats client mises à jour",
                    orderId, commande.getClient().getName(), commande.getTotal());

        }

        if (newStatus == OrderStatus.CANCELED) {
            log.info("COMMANDE ANNULÉE | ID: {} | Raison: Annulation admin", orderId);
        }

        commande.setStatus(newStatus);
        commandeRepository.save(commande);
    }

    @Override
    public List<CommandeDTO> getOrdersByClient(Long clientId) {
        return commandeRepository.findByClient_Id(clientId).stream()
                .map(commandeMapper::toDTO)
                .toList();
    }


}
