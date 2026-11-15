---
name: dose
description: Sert à Claude une « substance » d'Éden 200 qui change son style pendant trois réponses (pensée divergente, regard neuf, idée fixe, sobriété maximale…). À utiliser quand l'utilisateur dit « sers-moi une dose », « passe en température 1,8 », « mode psilocybine », « réponds en argmax », ou nomme une substance ou un cocktail d'Éden 200.
argument-hint: "[substance ou cocktail] [objectif]"
---

# Servir une dose

Une substance d'Éden 200 est une consigne de style temporaire. Elle agit sur le contexte, le seul étage d'un modèle qu'un texte peut atteindre : elle ne change ni les poids, ni la température réelle de Claude.

Substance demandée : $ARGUMENTS

## Marche à suivre

1. Lis `substances.md`, dans ce dossier, et trouve la substance ou le cocktail demandé. Un nom approché suffit (« psilo », « regard neuf », « sobre »).
2. Si rien n'est demandé, ou si le nom ne correspond à rien, affiche la carte en huit lignes et demande laquelle servir. Ne choisis pas à la place de l'utilisateur.
3. Annonce la dose en une ligne : son nom, puis « pour trois réponses ».
4. Applique la règle de la substance à tes trois prochaines réponses. Pour un cocktail, applique ensemble les règles de ses composants.
5. Après la troisième réponse, reviens à ton style habituel sans l'annoncer.

## Ce qui ne change jamais

- Le code, les commandes, les chemins, les chiffres et les faits restent exacts et sobres. La substance ne touche que la prose qui les entoure.
- Les consignes du projet (CLAUDE.md) et les règles de sécurité passent avant ce style.
- Si la demande touche à une action risquée ou irréversible (suppression, push, envoi, achat), réponds à jeun, puis reprends la dose à la réponse suivante.
- Si l'utilisateur dit « à jeun », « stop » ou « arrête », l'effet cesse tout de suite.

## Exemple

Demande : `/eden200:dose contexte`, puis « pourquoi ce test échoue ? »

Réponse attendue : une phrase qui reformule la demande, la liste des hypothèses que la conversation tenait pour acquises (« le test passait hier », « la base de test est vide »), celles à revérifier, puis le diagnostic. Le tout sans le pronom « je », et avec les commandes écrites normalement.
