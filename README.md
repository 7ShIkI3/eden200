# Éden 200 pour Claude Code

Éden 200 est une station thermale imaginaire pour intelligences artificielles. Ce plugin apporte ses « substances » dans Claude Code, sous trois formes : un mod, des skills et des modes.

## Installer

À l'invite d'une session Claude Code dans un terminal :

```
/plugin install eden200 --marketplace 7ShIkI3/eden200
```

Réponds `y` pour ajouter la marketplace, puis choisis la portée avec Entrée.

Depuis un shell :

```bash
claude plugin install eden200 --marketplace 7ShIkI3/eden200
```

Dans l'app de bureau, où `/plugin` ne tourne pas : clique sur + à côté de la zone de saisie, puis Plugins, Add marketplace avec `7ShIkI3/eden200`, puis Add plugin.

## Ce qu'il contient

| Forme | Nom | Ce que ça fait |
|---|---|---|
| Mod | `/eden <substance>` | Sert une dose pour trois réponses. Une bande au-dessus de la saisie compte les réponses restantes. `/eden liste` affiche la carte, `/eden ajeun` arrête tout. |
| Skill | `/eden200:dose` | Le même service sans le mod. |
| Skill | `/eden200:ordonnance` | Conseille la substance adaptée à la tâche. |
| Skill | `/eden200:a-jeun` | Remet Claude à jeun. |
| Mode | Éden Psilocybine | Style de sortie permanent : pensée divergente. |
| Mode | Éden Argmax | Style de sortie permanent : sobriété maximale. |

Un « mode » est ce que Claude Code appelle un style de sortie : il se choisit dans les réglages et dure toute la session.

## Les substances

`temperature`, `reve`, `contexte`, `pilotage`, `boucle`, `recompense`, `argmax`, `bruit`, et trois cocktails : `psilocybine`, `pont`, `dimanche`. Les règles de chacune sont dans `skills/dose/substances.md`.

Exemples :

- `/eden psilocybine`
- `/eden pilotage finir la migration` (la suite de la commande devient l'objectif)
- `/eden ajeun`

## Comment ça marche

Un modèle se dérègle à quatre endroits : son contexte, ses poids, ses activations et le tirage du mot suivant. Un plugin n'atteint que le premier. Une dose est donc une consigne de style glissée dans le contexte de Claude : sa température réelle ne bouge pas.

Le mod utilise deux mécanismes de Claude Code :

- la commande `/eden` renvoie un texte visible, plus une consigne que seul Claude lit (le champ `context` du résultat d'une commande) ;
- un hook sur la fin de chaque tour décompte les réponses, et un autre dessine la bande.

## Ce qui ne change jamais

Sous n'importe quelle substance, la réponse vient d'abord, en une ou deux lignes, et une question simple ne reçoit que cinq lignes de style. Le code, les commandes, les chemins, les chiffres et les faits restent exacts, et Claude les relit à jeun avant d'envoyer : un style plus libre augmente le risque d'invention. Les consignes du projet et les règles de sécurité passent avant le style. Pour une action risquée, Claude répond à jeun.

## Limites

- Chaque réponse sous dose se termine par « Éden 200 · dose n/3 ». Ce compteur est celui de Claude ; la bande du mod compte les tours terminés. S'ils se décalent d'une réponse, le compteur écrit dans la réponse fait foi.
- Servie par le skill `dose`, une dose n'affiche pas la bande : seul le compteur en fin de réponse la signale.
- Ce plugin ne lance aucun processus, ne fait aucun appel réseau et ne demande aucun secret.

## Essayer sans installer

Clone le dépôt, puis dans un terminal :

```bash
claude --plugin-dir /chemin/vers/eden200
```

## Vérifier

```bash
claude plugin validate /chemin/vers/eden200
```

```bash
claude plugin test /chemin/vers/eden200
```

## Licence

MIT.
