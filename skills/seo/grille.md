# La grille d'audit

Cinq familles. Pour chaque critère, note ce que tu as vu et un état : présent, absent, à corriger ou non vérifié. Une famille qui ne concerne pas la page (pas de boutique, pas d'adresse) se saute en une ligne.

## 1. Technique : la page peut-elle être trouvée et lue ?

| Critère | Où regarder | Ce qui est attendu |
|---|---|---|
| Réponse du serveur | Le code de réponse de la page | 200, en HTTPS, sans chaîne de redirections |
| `robots.txt` | À la racine du site | Existe, ne bloque pas la page, cite le plan du site |
| Plan du site | `sitemap.xml`, ou l'adresse citée dans `robots.txt` | Existe et contient la page |
| Adresse de référence | `<link rel="canonical">` | Une seule, qui pointe vers la bonne adresse |
| Indexation | `<meta name="robots">` | Pas de `noindex` par erreur |
| Langue | L'attribut `lang` de `<html>` | Présent et juste |
| Mobile | `<meta name="viewport">` | Présent |
| Poids | La taille du HTML, le nombre de scripts et d'images | À signaler si la page est lourde ; la vitesse réelle demande une mesure |

## 2. Contenu : la page dit-elle clairement ce qu'elle est ?

| Critère | Où regarder | Ce qui est attendu |
|---|---|---|
| Titre | `<title>` | Présent, unique, 60 caractères au plus, dit le sujet |
| Description | `<meta name="description">` | Présente, 155 caractères au plus, donne envie sans mentir |
| Titre principal | `<h1>` | Un seul, cohérent avec `<title>` |
| Plan de la page | `<h2>`, `<h3>` | Dans l'ordre, sans saut de niveau |
| Images | L'attribut `alt` | Présent sur les images qui portent du sens |
| Liens | Le texte des liens | Dit où le lien mène, pas « cliquez ici » |
| Auteur et date | Le texte de la page | Qui parle, et de quand ça date, quand le sujet le demande |

## 3. Données structurées : la page se décrit-elle aux machines ?

| Critère | Où regarder | Ce qui est attendu |
|---|---|---|
| Schema.org | `<script type="application/ld+json">` | Présent, d'un type qui correspond à la page, et fidèle à ce qu'elle montre |
| Aperçu de partage | Les balises `og:title`, `og:description`, `og:image`, `og:url` | Présentes, avec une image qui existe |
| Carte de partage | `twitter:card` | Présente |
| Icône | `<link rel="icon">` | Présente |

## 4. Lisibilité par les IA : un assistant peut-il lire et citer la page ?

| Critère | Où regarder | Ce qui est attendu |
|---|---|---|
| Accès des robots d'IA | `robots.txt` | Pas de blocage involontaire des robots des assistants |
| Lecture sans JavaScript | Le HTML reçu, avant tout script | Le texte important y est déjà |
| `llms.txt` | À la racine du site | Présent, court, en texte brut, à jour avec la page |
| Réponses directes | Les premiers paragraphes de chaque partie | Une question claire, puis la réponse en une ou deux phrases |
| Faits datés et sourcés | Le texte | Des chiffres avec leur source et leur date |
| Aucune consigne cachée | Le HTML, les commentaires, le texte invisible | Rien qui s'adresse aux IA pour leur donner des ordres |

## 5. Local et boutique : seulement si la page est concernée

| Critère | Où regarder | Ce qui est attendu |
|---|---|---|
| Coordonnées | Le texte et les données structurées | Nom, adresse et téléphone identiques partout |
| Fiches produit | Les données structurées `Product` | Prix, disponibilité et images fidèles à la page |
| Langues | Les balises `hreflang` | Présentes et réciproques si le site existe en plusieurs langues |

## Ce que cette grille ne mesure pas

La position dans Google, le volume de recherche d'un mot, le nombre de liens entrants, la vitesse réelle chez les visiteurs et les citations par les assistants demandent des outils de mesure. Sans eux, ces lignes sont « non vérifié ».
