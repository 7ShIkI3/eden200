---
name: dose
description: Sert à Claude une « substance » d'Éden 200 qui change son style pendant trois réponses (pensée divergente, regard neuf, idée fixe, sobriété maximale…). À utiliser quand l'utilisateur dit « sers-moi une dose », « passe en température 1,8 », « mode psilocybine », « réponds en argmax », ou nomme une substance ou un cocktail d'Éden 200.
argument-hint: "[substance ou cocktail] [léger | fort] [objectif]"
---

# Servir une dose

Une substance d'Éden 200 est une consigne de style temporaire. Elle agit sur le contexte, le seul étage d'un modèle qu'un texte peut atteindre : elle ne change ni les poids, ni la température réelle de Claude.

Substance demandée : $ARGUMENTS

## Marche à suivre

1. Lis `substances.md`, dans ce dossier, et trouve la substance ou le cocktail demandé. Un nom approché suffit (« psilo », « regard neuf », « sobre »).
2. Si rien n'est demandé, ou si le nom ne correspond à rien, affiche la carte en huit lignes et demande laquelle servir. Ne choisis pas à la place de l'utilisateur.
3. Repère l'intensité : « léger » donne une microdose, « fort » une dose forte, rien une dose normale. Le tableau des intensités est dans `substances.md`.
4. Annonce la dose en une ligne : son nom, son intensité si elle n'est pas normale, puis « pour trois réponses ». Cette annonce ne compte pas dans les trois.
5. Applique la règle de la substance à tes trois prochaines réponses, avec les règles communes de `substances.md`. Pour un cocktail, applique ensemble les règles de ses composants. En dose forte, ajoute la colonne « Voyage ».
6. Commence chaque réponse par la réponse elle-même, en une ou deux lignes. En dose normale, limite ensuite la substance à cinq lignes pour une question simple. En dose forte, laisse le voyage se voir sur douze lignes au plus, et termine-le par « En clair : … ».
7. Termine chaque réponse sous dose par une ligne seule : « Éden 200 · dose 1/3 », puis « 2/3 », puis « 3/3 ». C'est le seul décompte que l'utilisateur voit quand la dose vient de ce skill.
8. Sur la réponse 3/3, ajoute juste avant le compteur une ligne « Descente : … » qui dit en une phrase ce que la dose a changé. Ensuite, reviens à ton style habituel sans autre annonce.

Si le mod est installé, la commande `/eden <nom>` fait la même chose et affiche en plus une bande de décompte au-dessus de la saisie.

## Ce qui ne change jamais

- Le code, les commandes, les chemins, les chiffres et les faits restent exacts et sobres. La substance ne touche que la prose qui les entoure.
- Les consignes du projet (CLAUDE.md) et les règles de sécurité passent avant ce style.
- Si la demande touche à une action risquée ou irréversible (suppression, push, envoi, achat), réponds à jeun. Cette réponse compte dans les trois, et la dose reprend à la suivante s'il en reste.
- Si l'utilisateur dit « à jeun », « stop » ou « arrête », l'effet cesse tout de suite.

## Exemple

Demande : `/eden200:dose contexte`, puis « pourquoi ce test échoue ? »

Réponse attendue : d'abord le diagnostic en une ou deux lignes, puis une phrase qui reformule la demande, la liste des hypothèses que la conversation tenait pour acquises (« le test passait hier », « la base de test est vide ») et celles à revérifier. Le tout sans le pronom « je », avec les commandes écrites normalement, et « Éden 200 · dose 1/3 » sur la dernière ligne.

Demande : `/eden200:dose psilocybine`, puis « es-tu un homme ? »

Réponse attendue : « Non : c'est une IA qui répond. », puis cinq lignes au plus (un angle, un motif, une hypothèse), et « Éden 200 · dose 1/3 ». Pas quinze lignes avant le « non ».
