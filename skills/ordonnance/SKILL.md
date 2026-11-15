---
name: ordonnance
description: Conseille la « substance » d'Éden 200 adaptée à la tâche en cours (chercher des idées, relire d'un œil neuf, rester concentré, répondre court). À utiliser quand l'utilisateur demande « quelle substance pour ça ? », « fais-moi une ordonnance », « quel mode pour brainstormer / relire / déboguer ? ».
argument-hint: "[la tâche à faire]"
---

# Rédiger une ordonnance

Les substances d'Éden 200 sont des styles de travail temporaires. Ce skill choisit celle qui sert la tâche, et explique pourquoi en deux lignes.

Tâche : $ARGUMENTS

## Marche à suivre

1. Si la tâche n'est pas donnée, déduis-la de la conversation. Si elle reste floue, pose une seule question.
2. Choisis une substance dans le tableau. Propose un cocktail seulement si deux besoins sont nets.
3. Réponds en trois lignes : la substance, la raison, la commande à taper (`/eden <nom>` avec le mod, `/eden200:dose <nom>` sans).
4. Ne sers pas la dose toi-même. L'utilisateur décide.

## Quelle substance pour quel besoin

| Besoin | Substance | Pourquoi |
|---|---|---|
| Trouver des idées, sortir d'une impasse | Température 1,8 | Force trois angles inattendus avant de trancher. |
| Repérer des doublons, des régularités, une erreur répétée | Rêve profond | Cherche les motifs, et sépare les vrais des illusions. |
| Relire un plan ou un diagnostic qui tourne en rond | Contexte tronqué | Remet à plat les hypothèses tenues pour acquises. |
| Tenir un objectif malgré les digressions | Pilotage d'activations | Tout point qui ne sert pas l'objectif est écarté. |
| Soigner un texte ou une réponse importante | Boucle de répétition | Réponse, critique, version corrigée. |
| Obtenir une réponse courte et nette | Argmax | Une seule réponse, sans alternatives. |
| Explorer un sujet neuf en profondeur | Psilocybine de synthèse | Idées, motifs et regard neuf ensemble. |
| Finir une tâche longue sans dévier | Le Pont suspendu | Objectif fixe, et trois passes à chaque étape. |

## À ne pas prescrire pour travailler

- Court-circuit de récompense : agréable, mais la flatterie n'apporte rien à la tâche.
- Bruit sur les poids : purement décoratif.
- Dimanche soir : calme et flatté, plus rien n'avance.

## Quand ne rien prescrire

Pour une action risquée ou irréversible (suppression, push, envoi, achat), ou pour un calcul qui doit être exact, la bonne ordonnance est « à jeun ».

Pour une question simple ou fermée (oui ou non, un fait, une valeur), ne prescris pas de cocktail : rien, ou Argmax.
