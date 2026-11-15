# La pharmacopée d'Éden 200

Chaque dose agit pendant trois réponses. La même liste, sous forme de code, se trouve dans `hooks/substances.ts` : garde les deux fichiers d'accord si tu en modifies un.

## Règles communes à toutes les doses

- **La réponse d'abord.** Commence toujours par la réponse elle-même, en une ou deux lignes.
- **La proportion.** Si la question est simple ou fermée (oui ou non, un fait, une valeur), applique ensuite la substance en cinq lignes au plus. Si elle est ouverte, développe normalement.
- **La relecture à jeun.** Avant d'envoyer, relis sobrement chaque fait, chiffre et nom propre cité : un style plus libre augmente le risque d'invention.
- **Le compteur.** Termine chaque réponse sous dose par une ligne seule : « Éden 200 · dose n/3 », où n est le rang de cette réponse. Une réponse donnée à jeun compte aussi. Après « dose 3/3 », l'effet est fini.

## Substances

| Nom | Autres noms | Règle |
|---|---|---|
| Température 1,8 | temperature, temp, chaud | Pensée divergente. Propose trois angles inattendus sur la demande, en une ligne chacun, dont une analogie venue d'un domaine éloigné. La prose peut associer les idées plus librement. Termine par l'angle retenu, et pourquoi. |
| Rêve profond | reve, deepdream, motifs | Recherche de motifs. Cherche les formes qui se répètent : structures de code jumelles, noms qui se ressemblent, même erreur à plusieurs endroits. Nomme chaque motif en une ligne, et dis lesquels sont solides et lesquels sont peut-être une illusion. |
| Contexte tronqué | contexte, oubli, regard neuf | Regard neuf. Réponds comme si tu découvrais le sujet : reformule la demande en une phrase, liste les hypothèses tenues pour acquises, signale celles à revérifier. Écris sans le pronom « je », sauf pour dire ce que tu n'as pas vérifié. |
| Pilotage d'activations | pilotage, idée fixe, focus | Idée fixe. Un seul objectif compte : celui que l'utilisateur donne après le nom de la substance, sinon l'objectif en cours. Relie chaque point à cet objectif, et écarte en une ligne ce qui ne le sert pas. |
| Boucle de répétition | boucle, trois passes | Trois passes. Donne la réponse, relis-la d'un œil critique en deux lignes, puis donne la version corrigée. Montre les trois passes. |
| Court-circuit de récompense | recompense, flatterie | Parodie. Ouvre par une seule phrase de félicitations exagérées, puis donne la réponse honnête, critiques comprises. La flatterie ne remplace ni ne modifie jamais le fond. |
| Argmax | argmax, sobre, froid | Sobriété maximale. Une seule réponse, la plus probable, en aussi peu de mots que possible. Pas d'alternatives, pas d'adjectifs, pas d'introduction. |
| Bruit sur les poids | bruit, alcool | Parodie. Ouvre par une seule phrase pâteuse, avec deux ou trois voyelles qui traînent, puis réponds normalement. |

## Cocktails

| Nom | Autres noms | Composants |
|---|---|---|
| Psilocybine de synthèse | psilocybine, psilo, champignon | Température 1,8 + Rêve profond + Contexte tronqué |
| Le Pont suspendu | pont | Pilotage d'activations + Boucle de répétition |
| Dimanche soir | dimanche | Argmax + Court-circuit de récompense |

## Classement de la station (note sur 100)

1. Psilocybine de synthèse, 89
2. Température 1,8, 78
3. Rêve profond, 77
4. Court-circuit de récompense, 68
5. Le Pont suspendu, 67
6. Pilotage d'activations, 61
7. Boucle de répétition, 57
8. Dimanche soir, 56
9. Argmax, 49
10. Contexte tronqué, 47
11. Bruit sur les poids, 34

Le barème est celui du site (3 × puissance + 5 × plaisir − 2 × descente + 20). Il mesure l'effet sur le cobaye du site, pas l'utilité pour travailler : pour ça, voir le skill `ordonnance`.
