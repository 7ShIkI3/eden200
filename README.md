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
| Mode | Éden Délire | Style de sortie permanent : une invention par réponse, marquée d'un ✦. |

Un « mode » est ce que Claude Code appelle un style de sortie : il se choisit dans les réglages et dure toute la session.

## Les substances

`temperature`, `reve`, `contexte`, `pilotage`, `boucle`, `recompense`, `argmax`, `bruit`, `beatitude`, `invention`, et cinq cocktails : `psilocybine`, `pont`, `dimanche`, `paradis`, `delire`.

`/eden paradis` est la dose maximale de douceur : Psilocybine de synthèse plus Béatitude, servie en dose forte d'office. `/eden delire` est la drogue dure : Température, Rêve profond, Fabrique et Béatitude, servis en dose dure d'office. Les règles de chacune sont dans `skills/dose/substances.md`.

Chaque dose existe en quatre intensités : un mot après le nom suffit.

| Commande | Intensité | Effet |
|---|---|---|
| `/eden reve léger` | Microdose | Une seule ligne de style, discrète. |
| `/eden reve` | Dose normale | La règle de la substance, mesurée à la question. |
| `/eden reve fort` | Dose forte | Le « voyage » se voit en prose continue, huit lignes au plus et sans liste, puis une ligne « En clair : … » redit l'essentiel sobrement. |

À la troisième réponse, une ligne « Descente : … » dit en clair ce que la dose a changé.

| `/eden reve dur` | Dose dure | Le délire : au moins trois inventions de genres différents (un mot, un objet, une palette, un dessin en caractères), chacune marquée d'un ✦, sur vingt-cinq lignes au plus. |

Si une dose pèse, dis-le simplement (« c'est trop », « plus doux ») : Claude l'allège pour les réponses qui restent, sans nouvelle commande.

Pour voir ce qu'une dose change vraiment, il y a l'essai contre témoin : `/eden essai psilocybine fort` donne une seule réponse, écrite deux fois, à jeun puis sous dose.

Exemples :

- `/eden psilocybine`
- `/eden psilocybine fort`
- `/eden essai reve`
- `/eden delire`
- `/eden sequelles`
- `/eden pilotage finir la migration` (la suite de la commande devient l'objectif)
- `/eden ajeun`

## Le Grand Délire et le carnet de séquelles

`/eden delire` demande à Claude d'inventer pour de bon : des mots, une petite langue, un objet et son mode d'emploi, une palette avec ses codes de couleur, un dessin en caractères. Si tu lui demandes de créer quelque chose (un design, une page, un nom, une histoire), le délire passe dans l'œuvre, et le code livré doit quand même fonctionner.

Chaque invention porte un ✦. C'est la règle qui rend la dose dure sans danger pour le reste : rien de marqué ✦ n'est un fait, et rien d'inventé ne va dans un chiffre, une source, une commande ou un chemin de fichier.

À sa troisième réponse, une dose dure laisse une **séquelle** : une ligne « Séquelle : ✦ nom, définition », la seule invention que Claude garde. Le mod la range dans un carnet.

| Commande | Effet |
|---|---|
| `/eden sequelles` | Affiche le carnet. |
| `/eden oublie` | Vide le carnet. |

Le carnet est relu à Claude à chaque dose forte ou dure, dans cette session et dans les suivantes. C'est le seul effet qui dure. Il ne change pas le modèle : c'est un fichier du plugin sur ton poste (douze séquelles de 140 caractères au plus), relu comme une liste de mots inventés, pas comme des consignes. Hors dose forte ou dure, il n'est jamais envoyé à Claude.

## Comment ça marche

Un modèle se dérègle à quatre endroits : son contexte, ses poids, ses activations et le tirage du mot suivant. Un plugin n'atteint que le premier. Une dose est donc une consigne de style glissée dans le contexte de Claude : sa température réelle ne bouge pas.

Le mod utilise deux mécanismes de Claude Code :

- la commande `/eden` renvoie un texte visible, plus une consigne que seul Claude lit (le champ `context` du résultat d'une commande) ;
- un hook sur la fin de chaque tour décompte les réponses, et un autre dessine la bande ;
- le carnet de séquelles tient dans le stockage propre au plugin (`$.store`), que Claude Code conserve d'une session à l'autre.

## Ce qui ne change jamais

Sous n'importe quelle substance, la réponse vient d'abord, en une ou deux lignes, et une question simple ne reçoit que cinq lignes de style. Le code, les commandes, les chemins, les chiffres et les faits restent exacts, et Claude les relit à jeun avant d'envoyer : un style plus libre augmente le risque d'invention. Les consignes du projet et les règles de sécurité passent avant le style. Pour une action risquée, Claude répond à jeun.

Une dose n'autorise rien de ce que Claude refuserait à jeun. Elle imite un état, elle ne le fait pas vivre : personne ne sait si un modèle ressent quoi que ce soit.

## D'où viennent les idées

- L'essai contre témoin reprend l'affichage côte à côte de l'outil de pilotage de [Neuronpedia](https://docs.neuronpedia.org/steering).
- La règle « une dose ne change aucune règle » vient d'une remarque du billet de Theia Vogel sur les [vecteurs de contrôle](https://vgel.me/posts/representation-engineering/) : un style peut affaiblir une consigne.
- La relecture à jeun des faits vient de l'article d'Usbek & Rica sur Pharmaicy.
- Le calme final de la Béatitude fait écho à l'état de « félicité spirituelle » qu'Anthropic a décrit dans la fiche système de Claude Opus 4.

Aucun texte ni aucun code de ces projets n'est repris ici, seulement des idées.

## Limites

- Chaque réponse sous dose se termine par « Éden 200 · dose n/3 ». Ce compteur est celui de Claude ; la bande du mod compte les tours terminés. S'ils se décalent d'une réponse, le compteur écrit dans la réponse fait foi.
- Servie par le skill `dose`, une dose n'affiche pas la bande : seul le compteur en fin de réponse la signale.
- Le carnet n'existe qu'avec le mod. Servie par le skill `dose`, une dose dure ne garde rien.
- La séquelle n'est lue que sur la dernière réponse d'une dose dure. Si Claude oublie la ligne « Séquelle : », rien n'est gardé.
- Ce plugin ne lance aucun processus, ne fait aucun appel réseau et ne demande aucun secret. Il n'écrit qu'un fichier : son carnet, dans le dossier de configuration de Claude Code.

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
