# VOXEL STUDIO MVP - PLANNING DE DÉVELOPPEMENT

_Objectif: Alpha Patreon pour fin juillet 2024_

## 🎯 FEATURES CIBLES MVP

- [x] Enchantments (existant - à améliorer)
- [ ] Loot Tables
- [ ] Recipes
- [ ] Structures (worldgen/structure + worldgen/structure_set + data/structure)
- [ ] GitHub Integration
- [ ] Vanilla Refonte
- [ ] Nouvelles features Enchantments

---

## 📅 SEMAINE 1 (2-8 JUIN)

### 2 Juin (Lundi) - Refonte Actions

- [x] **Refonte des actions vers un format plus stable à l'avenir**
  - [x] Analyser l'architecture actuelle des actions dans voxel-breeze
  - [x] Définir le nouveau format d'actions standardisé
  - [x] Migrer les actions existantes vers le nouveau format
  - [x] Tests de régression sur les actions refactorisées
  - [x] Documentation du nouveau système d'actions

### 3 Juin (Mardi) - Vérifications & Structure Setup

- [x] **Dernière vérification de Enchantment, Loot et Recipe**
  - [x] Audit complet des schemas existants
  - [x] Validation des parsers et compilers
  - [x] Tests end-to-end sur les 3 concepts
- [x] **Début d'implémentation de Structure et Structure Set (Simple)**
  - [x] Créer `voxel-breeze/src/core/schema/structure/types.ts`
  - [x] Implémenter schema de base pour worldgen/structure
  - [x] Implémenter schema de base pour worldgen/structure_set
- [x] **Rajout des tests et actions**
  - [x] Tests unitaires pour structure schema
  - [x] Actions CRUD pour structures

### 4 Juin (Mercredi) - Structures NBT & Preview

- [ ] **Gestion des structures NBT**
  - [ ] Parser pour fichiers .nbt dans data/structure/
  - [ ] Integration NBT structures dans le schema
  - [ ] Validation et conversion NBT vers JSON
- [ ] **Système de prévisualisation**
  - [ ] Composant de preview 3D basique pour structures
  - [ ] Renderer pour afficher les blocs des structures
  - [ ] Interface de navigation dans la structure
- [ ] **Parcourir les template pools pour récupérer toutes les structures**
  - [ ] Parser pour worldgen/template_pool
  - [ ] Extraction automatique des références de structures
  - [ ] Mapping des dépendances entre pools et structures

### 5 Juin (Jeudi) - Vérifications & Début UI Loot

- [ ] **Dernière vérifications des 4 concepts**
  - [ ] Tests d'intégration Enchantment + Loot + Recipe + Structure
  - [ ] Validation des références croisées
  - [ ] Performance testing avec gros datapacks
- [ ] **Début de la création des interfaces - Loot**
  - [ ] Créer `src/components/tools/section/loot/`
  - [ ] Implémenter `LootMain.tsx` (MVP)
  - [ ] Implémenter `LootTechnical.tsx` (MVP)
- [ ] **Vue par groupe et vue compact, overview, sidebar (MVP)**
  - [ ] `LootOverview.tsx` avec filtering de base
  - [ ] `SidebarLoot.tsx` avec liste groupée
  - [ ] Navigation entre vues
- [ ] **Overview avec TanStack Virtualizer**
  - [ ] Setup TanStack Virtual dans LootOverview
  - [ ] Estimation row height pour loot tables
  - [ ] Performance optimization pour grandes listes

### 6 Juin (Vendredi) - Recipes UI

- [ ] **Affichage des recettes dans la sidebar par catégorie**
  - [ ] Groupement par type de recette (crafting, smelting, etc.)
  - [ ] Filtering et search dans sidebar
  - [ ] Compteurs par catégorie
- [ ] **Overview des recettes avec TanStack Virtualizer**
  - [ ] `RecipeOverview.tsx` avec virtualisation
  - [ ] Cards compactes pour preview recettes
  - [ ] Tri et filtering avancé
- [ ] **Composants pour le rendu des recettes**
  - [ ] `RecipeRenderer.tsx` pour affichage crafting grid
  - [ ] Support shaped/shapeless recipes
  - [ ] Preview des ingrédients et résultats

### 7 Juin (Samedi) - Structures UI

- [ ] **Affichage des structures dans la sidebar par catégorie**
  - [ ] Groupement worldgen vs data structures
  - [ ] Catégorisation par biome/dimension
  - [ ] Hierarchie template pools → structures
- [ ] **Réflexion sur l'interface pour les structures**
  - [ ] Brainstorming UX pour édition structures
  - [ ] Mock-ups interface structure editor
  - [ ] Définir les workflows utilisateur
- [ ] **Comment faire - Architecture**
  - [ ] Plan technique pour l'éditeur de structures
  - [ ] Integration avec le système de preview
  - [ ] Gestion des large structures (performance)

### 8 Juin (Dimanche) - Enchantment Features Avancées

- [ ] **Implémentation de la simulation d'enchantment**
  - [ ] Moteur de simulation probabiliste
  - [ ] Interface de test avec différents scenarios
  - [ ] Simulation table enchantment vs anvil vs books
- [ ] **Calcul des probabilités d'obtention**
  - [ ] Algorithme de calcul des taux d'apparition
  - [ ] Display des probabilités en temps réel
  - [ ] Facteurs d'influence (niveau, biome, etc.)
- [ ] **Mise en place des stats**
  - [ ] Dashboard statistiques enchantements
  - [ ] Métriques de balance (OP detection)
  - [ ] Comparaison avec vanilla
- [ ] **Rajout des presets pour gérer la difficulté d'obtention**
  - [ ] Presets: Common, Uncommon, Rare, Epic, Legendary
  - [ ] Interface simple pour appliquer presets
  - [ ] Custom preset creation
- [ ] **Rajout d'explications ici et là pour aider l'utilisateur**
  - [ ] Tooltips contextuels
  - [ ] Help bubbles sur options complexes
  - [ ] Guide intégré pour débutants
- [ ] **Global Actions**
  - [ ] Enable/disable all enchantments
  - [ ] Bulk weight modification
  - [ ] Mass export/import settings

---

## 📅 SEMAINE 2 (9-15 JUIN) - GITHUB INTEGRATION

### Objectifs de la semaine

- [ ] **Se connecter avec GitHub**
  - [ ] OAuth GitHub integration
  - [ ] User authentication flow
  - [ ] Token management et refresh
  - [ ] Repository access permissions

- [ ] **Bouton Make PR**
  - [ ] Interface pour créer pull requests
  - [ ] Commit message generation
  - [ ] Branch creation automatique
  - [ ] Preview des changements avant PR

- [ ] **Bouton Sync**
  - [ ] Synchronisation bidirectionnelle
  - [ ] Conflict detection et resolution
  - [ ] Auto-pull des changements distants
  - [ ] Status indicator de sync

- [ ] **Modifier le bouton settings - Sidebar en sections, Vue centrale**
  - [ ] Refonte architecture settings
  - [ ] Sidebar avec sections navigables
  - [ ] Vue centrale pour chaque section
  - [ ] Navigation breadcrumb

### Sections Settings à implémenter

- [ ] **Gérer son compte**
  - [ ] Profil utilisateur
  - [ ] Préférences personnelles
  - [ ] Données de connexion

- [ ] **Gérer l'abonnement**
  - [ ] Status Patreon
  - [ ] Plan features comparison
  - [ ] Billing information

- [ ] **Inviter, Kick et permissions utilisateurs**
  - [ ] Team management interface
  - [ ] Role-based permissions
  - [ ] Invitation system

- [ ] **Options générales**
  - [ ] Application settings
  - [ ] Performance preferences
  - [ ] Export/import configurations

---

## 🚀 PROCHAINES ÉTAPES (Planning à affiner)

### Features en attente

- [ ] Mobile responsiveness
- [ ] Advanced structure editor
- [ ] Collaboration temps réel
- [ ] Plugin marketplace
- [ ] Advanced analytics
- [ ] Automated testing suite

### Optimisations futures

- [ ] Performance monitoring
- [ ] Bundle size optimization
- [ ] Caching strategies
- [ ] Progressive loading

---

## 📝 NOTES & RÉFLEXIONS

### Décisions techniques

- **TanStack Virtual**: Choisi pour performance sur grandes listes
- **Architecture modulaire**: Chaque concept (loot, recipe, structure) isolé
- **Schema-first**: Backend stable avant UI
- **Progressive enhancement**: MVP puis features avancées

### Points d'attention

- [ ] Performance avec gros datapacks (>1000 éléments)
- [ ] Gestion mémoire pour structures NBT lourdes
- [ ] UX consistency entre tous les concepts
- [ ] Backward compatibility voxel-breeze

### Questions en suspens

- [ ] Limite de taille pour structures preview 3D
- [ ] Strategy de caching pour GitHub sync
- [ ] Granularité des permissions utilisateurs
- [ ] Format de storage des settings utilisateur

---

## ✅ CRITÈRES DE SUCCÈS MVP

### Fonctionnel

- [ ] Création/édition/suppression pour les 4 concepts
- [ ] Import/export datapack complet
- [ ] GitHub sync opérationnel
- [ ] Preview fonctionnel pour tous types

### Performance

- [ ] <3s loading time datapack moyen
- [ ] Smooth scrolling avec 1000+ éléments
- [ ] <1s response time pour actions CRUD

### UX

- [ ] Navigation intuitive entre concepts
- [ ] Error handling gracieux
- [ ] Onboarding compréhensible
- [ ] Mobile utilisable (tablet minimum)

---

_Dernière mise à jour: 2 Juin 2024_
