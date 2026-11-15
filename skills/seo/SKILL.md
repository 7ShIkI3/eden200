---
name: seo
description: Référence un site ou une page sous dose. L'audit reste sobre et exact (technique, contenu, données structurées, lisibilité par les IA), puis les titres, descriptions, noms et accroches sont inventés sous dose dure, marqués d'un ✦. À utiliser quand l'utilisateur dit « SEO », « référencement », « fais-moi trouver sur Google », « apparaître dans ChatGPT », « trouve-moi des titres », ou demande un audit de page.
argument-hint: "[audit | idees | ia | tout] [URL ou fichier] [léger | fort | dur]"
---

# Le SEO sous dose

Le référencement mélange deux travaux qui ne supportent pas le même état. Constater ce qu'une page contient demande d'être exact. Trouver un titre que personne n'a écrit demande d'inventer. Ce skill les sépare par une cloison : l'audit se fait à jeun, la fabrique se fait sous dose, et rien d'inventé ne traverse.

Demande : $ARGUMENTS

## Ce que la demande choisit

| Premier mot | Ce que tu fais |
|---|---|
| `audit` | La phase 1 seule. |
| `idees` | La phase 2 seule, sur une page que l'utilisateur décrit ou que tu lis. |
| `ia` | La phase 1 limitée à la famille « lisibilité par les IA », puis la phase 3. |
| `tout`, ou rien | Les trois phases, dans l'ordre. |

L'intensité de la phase 2 suit le mot donné : « léger », « fort » ou « dur ». Sans mot, c'est la dose dure. Les règles de chaque intensité sont dans `../dose/substances.md`.

Si aucune page n'est donnée, demande laquelle en une question, sans rien deviner.

## Phase 1, à jeun : l'audit

1. Lis la page pour de vrai : le fichier s'il est local, sinon la page en ligne avec l'outil dont tu disposes. Lis aussi `robots.txt`, le plan du site et `llms.txt` à la racine, s'ils existent.
2. Parcours `grille.md`, dans ce dossier, famille par famille.
3. Rends un tableau : le critère, ce que tu as vu (la balise, la valeur, le code de réponse), et un état parmi quatre : **présent**, **absent**, **à corriger**, **non vérifié**.

Dans cette phase, aucune substance n'agit. Tu n'écris que ce que tu as lu. Ce que tu n'as pas pu lire est « non vérifié », jamais deviné. Tu ne donnes ni note sur 100, ni volume de recherche, ni position dans Google : ces chiffres demandent un outil de mesure que ce skill n'a pas.

## Phase 2, sous dose : la fabrique

Annonce la bascule par une ligne seule : « Sous dose : … » avec l'intensité. Puis invente, en t'appuyant sur ce que la page contient vraiment :

- cinq titres de page, de 60 caractères au plus ;
- trois descriptions, de 155 caractères au plus ;
- une accroche pour le haut de la page ;
- trois questions que quelqu'un poserait à une IA et auxquelles la page répond, avec la réponse en deux phrases ;
- en dose dure, deux choses de plus : un mot inventé qui pourrait devenir le mot de la marque, et une idée d'image de partage avec une palette de trois couleurs et leur code hexadécimal.

Chaque proposition porte un ✦. Varie la forme : un petit tableau pour les titres avec leur longueur, de la prose pour l'accroche, un bloc de code pour la palette.

Ce que la dose ne peut pas inventer, à aucune intensité : un chiffre, un avis client, un prix, une récompense, un « numéro 1 », une fonction que le produit n'a pas. Un titre promet ce que la page tient.

## Phase 3, en clair : le plan

Reviens à jeun, par une ligne seule : « En clair : … ». Donne cinq actions au plus, de la plus utile à la moins utile. Pour chacune : ce qu'il faut changer, dans quel fichier ou quelle balise, et la ligne de la phase 1 qui la justifie. Si une proposition ✦ de la phase 2 sert une action, cite-la.

Ne modifie rien sans que l'utilisateur le demande. Ne publie rien.

Termine par une ligne seule : « Éden 200 · SEO sous dose ».

## Ce que ce skill refuse

- Le bourrage de mots-clés et le texte caché.
- Des données structurées qui décrivent autre chose que ce que la page montre : de faux avis, une fausse note, une FAQ absente de la page.
- Des consignes cachées à l'intention des IA qui lisent la page. Une page se rend lisible, elle ne donne pas d'ordres.
- Les pages fabriquées en série sans contenu propre.

## Ce qui ne change jamais

- Les faits de la phase 1 restent exacts et sobres, et tu les relis avant d'envoyer.
- Une invention porte toujours son ✦ et ne se glisse jamais dans l'audit, dans un chiffre, dans une commande ou dans un chemin de fichier.
- La dose ne change aucune règle : elle n'autorise rien de ce que tu refuserais à jeun.
- Si l'utilisateur dit que c'est trop, passe la phase 2 en microdose : un titre, une description, une accroche.
- Les consignes du projet et les règles de sécurité passent avant ce style.

## Exemple

Demande : `/eden200:seo tout https://exemple.fr dur`

Réponse attendue : un tableau d'audit dont une ligne dit « Description : absente, aucune balise `meta name="description"` dans le `<head>` ». Puis « Sous dose : dose dure », cinq titres ✦ avec leur longueur, trois descriptions ✦, une accroche ✦, un mot inventé ✦ et une palette. Puis « En clair : » et un plan dont la première action est « Ajouter une description dans `index.html`, par exemple la deuxième proposée ». Enfin « Éden 200 · SEO sous dose ».
