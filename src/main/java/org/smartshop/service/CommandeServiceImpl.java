package org.smartshop.service;

import lombok.RequiredArgsConstructor;
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

        for (OrderItemDTO itemDTO : commandeDTO.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé avec id : " + itemDTO.getProductId()));

            if (product.getDeleted()) {
                commande.setStatus(OrderStatus.REJECTED);
                commande.setMontantRestant(BigDecimal.ZERO);
                commandeRepository.save(commande);
                throw new BusinessException("Produit supprimé: " + product.getName());
            }

            if (product.getStock() < itemDTO.getQuantity()) {
                commande.setStatus(OrderStatus.REJECTED);
                commande.setMontantRestant(BigDecimal.ZERO);
                commandeRepository.save(commande);
                throw new BusinessException("Stock insuffisant pour produit: " + product.getName());
            }

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
        commande.setSubTotal(subTotal);

        BigDecimal discount = clientService.calculateLoyaltyDiscount(client.getTier(), subTotal);

        // PromoCode logic
        if (commandeDTO.getPromoCode() != null && !commandeDTO.getPromoCode().isBlank()) {
            String promoCode = commandeDTO.getPromoCode().trim().toUpperCase();

            if (!promoCode.matches("^PROMO-[A-Z0-9]{4}$")) {
                throw new BusinessException("Code promo invalide. Format attendu : PROMO-XXXX");
            }

            PromoCode promo = promoCodeRepository.findByPromoCodeAndUsedFalse(promoCode)
                    .orElseThrow(() -> new BusinessException("Code promo invalide ou déjà utilisé"));

            promo.setUsed(true);
            promoCodeRepository.save(promo);

            commande.setPromoCode(promo);
        }

        commande.setRemise(discount);

        BigDecimal totalHt = subTotal.subtract(discount);
        if (totalHt.compareTo(BigDecimal.ZERO) < 0) totalHt = BigDecimal.ZERO;

        BigDecimal tva = totalHt.multiply(tvaRate)
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalTtc = totalHt.add(tva)
                .setScale(2, RoundingMode.HALF_UP);

        commande.setTva(tva);
        commande.setTotal(totalTtc);
        commande.setMontantRestant(totalTtc);

        return commandeMapper.toDTO(commandeRepository.save(commande));
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

        Boolean hasPendingPayment = commande.getPayments().stream()
                .anyMatch(p -> p.getPaymentStatus() == PaymentStatus.EN_ATTENTE);
        if (hasPendingPayment) {
            throw new BusinessException("Impossible de confirmer : des paiements sont encore en attente d'encaissement");
        }

        if (newStatus == OrderStatus.CONFIRMED) {
            if (commande.getMontantRestant().compareTo(BigDecimal.ZERO) > 0) {
                throw new BusinessException("Commande ne peut pas être confirmée. Payment non complété.");
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
        }
        commande.setStatus(newStatus);
        commandeRepository.save(commande);
    }

}
