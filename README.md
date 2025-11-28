# SmartShop – API de Gestion Commerciale B2B

[![YouCode](https://img.shields.io/badge/YouCode-Maghreb-red?style=for-the-badge)](https://youcode.ma)
[![Simplon](https://img.shields.io/badge/Simplon-Maghreb-orange?style=for-the-badge)](https://simplon.co)

## Contexte du projet

**SmartShop** est une application web de gestion commerciale destinée à **MicroTech Maroc**, distributeur B2B de matériel informatique basé à Casablanca.

L’application permet de gérer un portefeuille de **650 clients actifs** avec :
- Système de fidélité à remises progressives (BASIC → SILVER → GOLD → PLATINUM)
- Paiements fractionnés multi-moyens par facture (Espèces ≤ 20 000 DH, Chèque, Virement)
- Traçabilité complète de tous les événements financiers via un historique immuable
- Optimisation de la gestion de trésorerie

## Caractéristiques techniques

- **100% Backend REST API** (aucune interface graphique)
- Tests et démonstrations via **Postman**
- Authentification par **session HTTP** (login/logout)
- Aucun JWT ni Spring Security
- Gestion des rôles :
    - `ADMIN` → employé MicroTech (accès complet)
    - `CLIENT` → entreprise cliente (lecture uniquement)

## Fonctionnalités implémentées

### 1. Gestion des Clients
- Création / Modification / Suppression / Consultation
- Suivi automatique :
    - Nombre total de commandes confirmées
    - Montant total cumulé dépensé
    - Date de première et dernière commande
    - Niveau de fidélité mis à jour automatiquement
    - Historique complet des commandes (ID, date, total TTC, statut)

### 2. Système de fidélité automatique
| Niveau     | Condition                                      | Remise applicable |
|------------|------------------------------------------------|-------------------|
| BASIC      | Par défaut                                     | 0%                |
| SILVER     | ≥ 3 commandes OU ≥ 1 000 DH                    | 5% (si ≥ 500 DH)  |
| GOLD       | ≥ 10 commandes OU ≥ 5 000 DH                   | 10% (si ≥ 800 DH) |
| PLATINUM   | ≥ 20 commandes OU ≥ 15 000 DH                  | 15% (si ≥ 1 200 DH) |

### 3. Gestion des Produits
- CRUD complet (soft delete)
- Pagination + filtre par nom

### 4. Gestion des Commandes
- Création multi-articles avec vérification stock
- Si stock insuffisant → commande créée avec statut **REJECTED** (traçabilité)
- Calcul automatique : sous-total, remise fidélité, code promo 5%, TVA 20%, total TTC
- Statuts : `PENDING` → `CONFIRMED` (seulement si paiement complet) / `CANCELED` (seulement si PENDING) / `REJECTED`
- Décrementation du stock uniquement à la confirmation

### 5. Paiements fractionnés multi-moyens
| Moyen      | Limites / Règles spécifiques                                      | Statut à création     |
|------------|--------------------------------------------------------------------|------------------------|
| Espèces    | Max 20 000 DH, référence `RECU-XXXXXX`                             | ENCAISSÉ immédiatement |
| Chèque     | Référence `CHQ-XXXXXX`, banque + échéance future obligatoires     | EN_ATTENTE             |
| Virement   | Référence `VIR-XXXXXX`, banque obligatoire                        | EN_ATTENTE             |

- Validation / Rejet des paiements par l’admin
- Mise à jour automatique du montant restant

### 6. Codes Promo
- Génération de codes uniques `PROMO-XXXX` (ADMIN uniquement)
- Remise fixe de 5% (cumulable avec fidélité)

## Technologies utilisées

- Java 17
- Spring Boot 3
- Spring Data JPA + Hibernate
- Lombok
- MapStruct
- BCrypt pour le hash des mots de passe
- PostgreSQL

## Sécurité & Contraintes respectées

- Session HTTP uniquement
- Filtre d’authentification personnalisé
- Restrictions strictes par rôle
- Toutes les validations Bean Validation (groupées par type de paiement)
- Gestion centralisée des erreurs (400, 401, 403, 404, 422)
- Arrondi bancaire à 2 décimales partout (`RoundingMode.HALF_UP`)

## Comment lancer le projet

```bash
git clone https://github.com/KhawlaBoukniter/smartshop.git
cd smartshop
./mvnw spring-boot:run
```

- L’API sera disponible sur : http://localhost:8080
- 