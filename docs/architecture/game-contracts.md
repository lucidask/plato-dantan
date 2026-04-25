# Contrat d’intégration des jeux — Plato Dantan

## 1. Rôle

Le contrat d’intégration définit comment un jeu s’intègre à Plato Dantan.

Il garantit que :

* tous les jeux suivent la même structure
* la plateforme peut communiquer avec n’importe quel jeu
* les jeux restent indépendants

---

## 2. Métadonnées d’un jeu

Chaque jeu doit fournir :

* gameId
* name
* description
* minPlayers
* maxPlayers
* supportsTeams

---

## 3. Création d’une partie

Le jeu doit exposer une fonction :

createMatch(config)

Elle retourne l’état initial du jeu.

---

## 4. État du jeu

Chaque jeu doit retourner un état structuré :

* phase du jeu
* joueurs
* scores
* table
* informations nécessaires à l’affichage

---

## 5. Actions

La plateforme envoie des actions au jeu :

* play_card
* draw_card
* reveal_initial_card
* autres selon le jeu

Chaque action contient :

* playerId
* type
* payload

---

## 6. Traitement d’une action

Le jeu doit exposer :

applyAction(state, action)

Cette fonction :

* valide l’action
* met à jour l’état
* produit des événements

---

## 7. Événements

Le jeu doit produire des événements :

* card_played
* trick_won
* draw_required
* trouver
* round_end
* match_end

Ces événements servent à l’interface.

---

## 8. Résultat d’une action

Chaque action retourne :

* le nouvel état
* la liste des événements

---

## 9. Indépendance des jeux

Chaque jeu :

* ne dépend pas des autres jeux
* peut être ajouté ou retiré sans casser la plateforme

---

## 10. Exemple

Le jeu game-3-7 doit respecter ce contrat.

La plateforme pourra alors :

* créer une partie
* envoyer une action
* récupérer l’état
* afficher le jeu
