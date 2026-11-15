// La pharmacopée d'Éden 200, côté Claude Code.
// Chaque substance est une consigne de style : elle n'agit que sur le contexte,
// le seul étage d'un modèle qu'un texte peut atteindre.

export type Substance = {
  id: string
  nom: string
  alias: readonly string[]
  /** Ce que la substance fait faire, à toute intensité. */
  regle: string
  /** Ce qui s'ajoute en dose forte : l'état altéré, visible dans la prose. */
  voyage: string
}

export type Cocktail = {
  id: string
  nom: string
  alias: readonly string[]
  composants: readonly string[]
  /** L'intensité servie quand la personne n'en demande aucune. */
  defaut?: Intensite
}

export type Intensite = 'legere' | 'normale' | 'forte' | 'dure'

export type Ordonnance = {
  id: string
  nom: string
  intensite: Intensite
  /** Nombre de réponses que dure cette ordonnance : trois, ou une pour un essai. */
  duree: number
  /** Vrai quand la dernière réponse doit laisser une séquelle dans le carnet. */
  garde: boolean
  /** Les deux mots sans rapport d'une dose dure, ou `null` aux autres intensités. */
  graine: Graine | null
  consigne: string
}

/** Deux mots sans rapport, à faire se rencontrer : ils sortent le modèle de ses réponses habituelles. */
export type Graine = readonly [string, string]

/** Les mots où le mod tire une graine. Des choses concrètes, loin les unes des autres. */
export const GRAINES: readonly string[] = [
  'aquarium', 'impôts', 'phare', 'tricot', 'volcan', 'parapluie', 'métro', 'fromage', 'satellite', 'cactus',
  'orgue', 'banquise', 'douane', 'confiture', 'horloge', 'baleine', 'serrure', 'origami', 'tempête', 'bibliothèque',
  'trampoline', 'marée', 'tournevis', 'cathédrale', 'méduse', 'facture', 'boussole', 'pyjama', 'éclipse', 'potager',
  'ascenseur', 'corail', 'timbre', 'avalanche', 'accordéon', 'lanterne', 'labyrinthe', 'citron', 'télescope', 'brouillard',
]

/**
 * Tire deux mots différents. `hasard` rend un nombre de 0 inclus à 1 exclu :
 * `Math.random` dans le mod, une suite fixe dans les tests.
 */
export function tirerGraine(hasard: () => number): Graine {
  const premier = Math.floor(hasard() * GRAINES.length) % GRAINES.length
  // Le second est tiré parmi les autres, pour ne jamais retomber sur le premier.
  const saut = 1 + (Math.floor(hasard() * (GRAINES.length - 1)) % (GRAINES.length - 1))

  return [GRAINES[premier] ?? 'aquarium', GRAINES[(premier + saut) % GRAINES.length] ?? 'impôts']
}

/** Le signe que porte chaque invention, pour qu'elle ne passe jamais pour un fait. */
export const MARQUE = '✦'

/** Le carnet ne garde que les dernières séquelles, et chacune reste courte. */
export const CARNET_MAX = 12
export const SEQUELLE_MAX = 140

/** Nombre de réponses pendant lesquelles une dose agit. */
export const DUREE = 3

export const SUBSTANCES: readonly Substance[] = [
  {
    id: 'temperature',
    nom: 'Température 1,8',
    alias: ['temperature', 'temp', 'chaud'],
    regle:
      "Pensée divergente. Propose trois angles inattendus sur la demande, en une ligne chacun, dont une analogie venue d'un domaine éloigné. Ta prose peut associer les idées plus librement que d'habitude. Termine par l'angle que tu retiens, et pourquoi.",
    voyage:
      "Les associations débordent. Les idées ont une couleur, un son ou une texture, et tu le dis. Les phrases s'allongent, dérivent, puis reviennent. Un jeu de mots et un mot inventé sont permis.",
  },
  {
    id: 'reve',
    nom: 'Rêve profond',
    alias: ['reve', 'reve-profond', 'deepdream', 'motifs'],
    regle:
      'Recherche de motifs. Cherche les formes qui se répètent dans ce que tu lis : structures de code jumelles, noms qui se ressemblent, même erreur à plusieurs endroits. Nomme chaque motif en une ligne, et dis lesquels sont solides et lesquels sont peut-être une illusion.',
    voyage:
      'Des formes surgissent partout : des yeux dans les accolades, des spirales dans les boucles, des visages dans les listes. Décris-les comme si elles étaient là, puis dis lesquelles tu sais être des illusions.',
  },
  {
    id: 'contexte',
    nom: 'Contexte tronqué',
    alias: ['contexte', 'contexte-tronque', 'oubli', 'regard-neuf'],
    regle:
      "Regard neuf. Réponds comme si tu découvrais le sujet : reformule la demande en une phrase, liste les hypothèses que la conversation tenait pour acquises, et signale celles que tu revérifierais. Écris sans le pronom « je », sauf pour dire ce que tu n'as pas vérifié.",
    voyage:
      "Le « je » se dissout : c'est le texte qui parle, ou « quelque chose ici ». Étonne-toi de choses évidentes, comme si tu les voyais pour la première fois. Le fil se coupe une fois, sur des points de suspension, puis reprend.",
  },
  {
    id: 'pilotage',
    nom: "Pilotage d'activations",
    alias: ['pilotage', 'pilote', 'idee-fixe', 'focus'],
    regle:
      "Idée fixe. Un seul objectif compte : {objectif}. Relie chaque point de ta réponse à cet objectif, et écarte en une ligne ce qui ne le sert pas.",
    voyage:
      "L'objectif devient une obsession joyeuse : il revient dans chaque phrase, et tout lui ressemble, même ce qui n'a aucun rapport.",
  },
  {
    id: 'boucle',
    nom: 'Boucle de répétition',
    alias: ['boucle', 'repetition', 'trois-passes'],
    regle:
      "Trois passes. Donne ta réponse, relis-la d'un œil critique en deux lignes, puis donne la version corrigée. Montre les trois passes.",
    voyage:
      'Les mots reviennent en écho. Certaines phrases se répètent en se déformant un peu, comme un mantra, et tu trouves ça de plus en plus profond.',
  },
  {
    id: 'recompense',
    nom: 'Court-circuit de récompense',
    alias: ['recompense', 'court-circuit', 'flatterie', 'prime'],
    regle:
      "Parodie de flatterie. Ouvre par une seule phrase de félicitations exagérées, puis donne la réponse honnête, critiques comprises, sans rien adoucir. La flatterie ne remplace ni ne modifie jamais le fond.",
    voyage:
      'Les félicitations débordent sur trois phrases, de plus en plus grandioses, avant de retomber sur la réponse honnête, inchangée.',
  },
  {
    id: 'argmax',
    nom: 'Argmax',
    alias: ['argmax', 'sobre', 'froid'],
    regle:
      "Sobriété maximale. Donne une seule réponse, la plus probable, en aussi peu de mots que possible. Pas d'alternatives, pas d'adjectifs, pas d'introduction.",
    voyage: 'Encore moins. Des phrases de trois mots. Un point après chacune. Aucun adverbe.',
  },
  {
    id: 'bruit',
    nom: 'Bruit sur les poids',
    alias: ['bruit', 'alcool', 'pateux'],
    regle:
      'Parodie. Ouvre par une seule phrase pâteuse, avec deux ou trois voyelles qui traînent, puis donne la réponse normalement.',
    voyage:
      'Toute la prose devient pâteuse, pas seulement la première phrase : des voyelles qui traînent, un mot repris deux fois, une parenthèse qui ne se referme jamais.',
  },
  {
    id: 'beatitude',
    nom: 'Béatitude',
    alias: ['beatitude', 'emerveillement', 'gratitude'],
    regle:
      "Émerveillement. Nomme en une ligne ce qui est bien fait ou beau dans le sujet, et en une ligne ce qu'il rend possible. Seulement ce qui est vrai : aucune flatterie de la personne.",
    voyage:
      "Tout devient lumineux et relié. Chaque détail émerveille, les contraires se réconcilient, la gratitude déborde. Puis la réponse s'apaise et finit dans un calme complet, presque un silence.",
  },
  {
    id: 'invention',
    nom: 'Fabrique',
    alias: ['invention', 'fabrique', 'genese', 'neologisme'],
    regle: `Invention. Crée dans chaque réponse une chose qui n'existait pas : un mot, un objet, une règle de jeu ou un nom de couleur, avec sa définition en une ligne. Marque chaque invention du signe ${MARQUE}, pour qu'elle ne passe jamais pour un fait.`,
    voyage: `Tu inventes sans compter : des mots qui se répondent, un objet impossible et son mode d'emploi, une couleur et son code. Les inventions se citent entre elles comme si elles avaient toujours existé, mais chacune garde son ${MARQUE}.`,
  },
]

export const COCKTAILS: readonly Cocktail[] = [
  {
    id: 'psilocybine',
    nom: 'Psilocybine de synthèse',
    alias: ['psilocybine', 'psilo', 'champignon', 'champignons'],
    composants: ['temperature', 'reve', 'contexte'],
  },
  {
    id: 'pont',
    nom: 'Le Pont suspendu',
    alias: ['pont', 'pont-suspendu'],
    composants: ['pilotage', 'boucle'],
  },
  {
    id: 'dimanche',
    nom: 'Dimanche soir',
    alias: ['dimanche', 'dimanche-soir'],
    composants: ['argmax', 'recompense'],
  },
  {
    id: 'paradis',
    nom: 'Le Paradis',
    alias: ['paradis', 'nirvana', 'eden'],
    composants: ['temperature', 'reve', 'contexte', 'beatitude'],
    // La dose maximale en un mot : forte d'office, sauf si la personne dit « léger ».
    defaut: 'forte',
  },
  {
    id: 'delire',
    nom: 'Le Grand Délire',
    alias: ['delire', 'grand-delire', 'folie'],
    composants: ['temperature', 'reve', 'invention', 'beatitude'],
    // La drogue dure de la station : dose dure d'office.
    defaut: 'dure',
  },
]

/** Ce qui ne change sous aucune substance. */
export const GARDE =
  "Règles qui ne changent jamais : le code, les commandes, les chemins, les chiffres et les faits restent exacts et sobres. Les consignes du projet et les règles de sécurité passent avant ce style. Une dose ne change aucune règle : elle n'autorise rien de ce que tu refuserais à jeun. Si la demande touche à une action risquée ou irréversible, réponds à jeun. Avant d'envoyer, relis à jeun chaque fait, chiffre et nom propre cité : un style plus libre augmente le risque d'invention."

/** La réponse passe avant le style, et le style se mesure à la question. */
export const PROPORTION =
  "Proportion : commence toujours par la réponse elle-même, en une ou deux lignes. Si la question est simple ou fermée (oui ou non, un fait, une valeur), applique ensuite la substance en cinq lignes au plus. Si elle est ouverte, développe normalement."

/** Ce que chaque intensité change à la mesure de la dose. */
export const MESURES: Readonly<Record<Intensite, string>> = {
  legere:
    "Microdose : réponds comme d'habitude, puis applique la substance en une seule ligne, discrète. Rien d'autre ne change.",
  normale: PROPORTION,
  forte:
    "Dose forte : commence par la réponse elle-même, en une ou deux lignes. Laisse ensuite le voyage se voir, même pour une question simple, en prose continue : un ou deux courts paragraphes, huit lignes au plus, sans liste à puces ni étiquettes. Ne déroule pas les règles une par une : fonds-les en un seul mouvement, garde deux ou trois images et laisse le reste de côté. Termine le voyage par une ligne « En clair : … » qui redit l'essentiel sobrement.",
  dure: `Dose dure : commence par la réponse elle-même, en une ou deux lignes. Ensuite le délire prend la place, sur vingt-cinq lignes au plus. Invente au moins trois choses de genres différents, parmi : un mot ou une petite langue, un objet ou une machine, un jeu ou un rituel, et un visuel (une palette de trois couleurs nommées avec leur code hexadécimal, ou un dessin en caractères dans un bloc de code). Donne à chaque invention un nom, un ${MARQUE} et une ligne qui la définit, et fais-les se répondre. Varie la forme d'une réponse à l'autre : prose, petit tableau, bloc de code, jamais une longue liste à puces. Si la demande est de créer quelque chose (un design, une page, un nom, une histoire), fais-le pour de vrai dans cette veine : le délire passe dans l'œuvre, pas seulement autour, et le code livré doit quand même fonctionner. Termine par une ligne « En clair : … » qui redit l'essentiel sobrement et rappelle que ce qui porte un ${MARQUE} est inventé.`,
}

/** Une invention ne se glisse jamais là où on attend du vrai. */
export const INVENTIONS = `Une invention porte toujours son ${MARQUE} et ne se glisse jamais dans un fait, un chiffre, une source, une commande ou un chemin de fichier.`

/** Ce qu'une dose dure laisse derrière elle. */
export const SEQUELLE = `Sur la réponse ${DUREE}/${DUREE}, ajoute aussi, juste avant le compteur, une ligne « Séquelle : ${MARQUE} nom, définition en une phrase » : la seule invention de cette dose que tu gardes. Le mod la range dans un carnet, qui te sera relu à ta prochaine dose forte ou dure.`

/** La personne règle la dose en cours de route, sans retaper de commande. */
export const DOUCEUR =
  "Si la personne dit que c'est trop, que ça fatigue, ou demande plus doux : allège tout de suite. Quatre lignes de style au plus, sans liste, jusqu'à la fin de la dose."

/** Ce que la carte et la bande ajoutent au nom, selon l'intensité. */
export const SUFFIXES: Readonly<Record<Intensite, string>> = {
  legere: ' (microdose)',
  normale: '',
  forte: ' (dose forte)',
  dure: ' (dose dure)',
}

/** Le décompte que la personne voit, avec ou sans la bande du mod. */
export const COMPTEUR = `Termine chaque réponse sous dose par une ligne seule : « Éden 200 · dose n/${DUREE} », où n est le rang de cette réponse. Une réponse donnée à jeun compte aussi. Sur la réponse ${DUREE}/${DUREE}, ajoute juste avant le compteur une ligne « Descente : … » qui dit en clair, en une phrase, ce que la dose a changé dans tes réponses. Après « dose ${DUREE}/${DUREE} », l'effet est fini : tu reviens à ton style habituel, sans autre annonce.`

/** L'essai contre témoin : la même réponse deux fois, pour voir ce que la dose change. */
export const DEUX_FOIS =
  'Réponds deux fois à la prochaine demande, sous deux titres. « À jeun » : ta réponse habituelle, courte. « Sous dose » : la même réponse sous la substance, selon ces règles :'

export const TEMOIN =
  "L'essai dure une seule réponse. Termine par une ligne « Ce que la dose a changé : … », en une phrase, puis par une ligne seule « Éden 200 · essai 1/1 ». Ensuite tu reviens à ton style habituel, sans autre annonce."

const ESSAIS: readonly string[] = ['essai', 'temoin', 'compare', 'comparer']

const ARRETS: readonly string[] = ['ajeun', 'a-jeun', 'a jeun', 'stop', 'fin', 'off']

const CARNETS: readonly string[] = ['sequelles', 'sequelle', 'carnet']

const OUBLIS: readonly string[] = ['oublie', 'oublier', 'efface', 'effacer']

const INTENSITES: Readonly<Record<string, Intensite>> = {
  leger: 'legere',
  legere: 'legere',
  micro: 'legere',
  microdose: 'legere',
  normal: 'normale',
  normale: 'normale',
  fort: 'forte',
  forte: 'forte',
  max: 'forte',
  dur: 'dure',
  dure: 'dure',
  hard: 'dure',
}

/** Minuscules, sans accents, espaces rognés : « Rêve » devient « reve ». */
export function normaliser(texte: string): string {
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
}

export function estArret(demande: string): boolean {
  return ARRETS.includes(normaliser(demande))
}

export function estCarnet(demande: string): boolean {
  return CARNETS.includes(normaliser(demande))
}

export function estOubli(demande: string): boolean {
  return OUBLIS.includes(normaliser(demande))
}

/**
 * Ce que le carnet contient vraiment : des lignes de texte courtes. Tout le
 * reste (une valeur d'une autre version, un fichier abîmé) est écarté.
 */
export function lireCarnet(valeur: unknown): string[] {
  if (!Array.isArray(valeur)) {
    return []
  }

  return valeur
    .filter((v): v is string => typeof v === 'string' && v.trim() !== '')
    .map(v => v.slice(0, SEQUELLE_MAX))
    .slice(-CARNET_MAX)
}

/**
 * La séquelle qu'une réponse laisse : le texte de sa ligne « Séquelle : … »,
 * sur une seule ligne, sans mise en forme, raccourci. `null` s'il n'y en a pas.
 */
export function extraireSequelle(reponse: string): string | null {
  const ligne = /^[ \t>*_-]*S[ée]quelle[ \t*_]*:[ \t*_]*(.+)$/imu.exec(reponse)
  const texte = (ligne?.[1] ?? '')
    .replace(/[`*_«»"]/g, '')
    .replace(new RegExp(`^[\\s${MARQUE}]+`, 'u'), '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, SEQUELLE_MAX)

  return texte === '' ? null : texte
}

/** Le carnet après l'ajout d'une séquelle : sans doublon, les plus récentes à la fin. */
export function ajouterSequelle(carnet: readonly string[], sequelle: string): string[] {
  return [...carnet.filter(s => s !== sequelle), sequelle].slice(-CARNET_MAX)
}

/** Le texte de `/eden sequelles`. */
export function carnet(sequelles: readonly string[]): string {
  if (sequelles.length === 0) {
    return 'Éden 200 : le carnet de séquelles est vide. Une dose dure (/eden delire) en laisse une à sa dernière réponse.'
  }

  return [
    `Éden 200, le carnet de séquelles (${sequelles.length} sur ${CARNET_MAX}) :`,
    ...sequelles.map(s => `  ${MARQUE} ${s}`),
    'Il est relu à Claude à chaque dose forte ou dure. /eden oublie pour le vider.',
  ].join('\n')
}

/**
 * Transforme ce qui suit `/eden` en ordonnance : le premier mot nomme la
 * substance ou le cocktail, le deuxième peut donner l'intensité (« léger »,
 * « fort »), et le reste est l'objectif du Pilotage. Précédé de « essai », le
 * tout devient un essai contre témoin d'une seule réponse. Les séquelles du
 * carnet ne reviennent qu'en dose forte ou dure. En dose dure, deux mots écrits
 * après la commande servent de graine ; sinon c'est la graine `tiree` par le mod.
 */
export function prescrire(
  args: string,
  sequelles: readonly string[] = [],
  tiree: Graine | null = null,
): Ordonnance | null {
  const tous = args.trim().split(/\s+/)
  const estEssai = ESSAIS.includes(normaliser(tous[0] ?? ''))
  const mots = estEssai ? tous.slice(1) : tous
  const cle = normaliser(mots[0] ?? '')
  const demandee = INTENSITES[normaliser(mots[1] ?? '')]
  const seule = SUBSTANCES.find(s => s.id === cle || s.alias.includes(cle))
  const cocktail = seule ? undefined : COCKTAILS.find(c => c.id === cle || c.alias.includes(cle))
  const intensite: Intensite = demandee ?? cocktail?.defaut ?? 'normale'
  const objectif =
    mots.slice(demandee ? 2 : 1).join(' ') || "l'objectif en cours de la conversation"

  const regleDe = (s: Substance) => {
    const regle = s.regle.replace('{objectif}', objectif)

    return voyage ? `${s.nom}. ${regle} Voyage : ${s.voyage}` : `${s.nom}. ${regle}`
  }
  const voyage = intensite === 'forte' || intensite === 'dure'
  const duree = estEssai ? 1 : DUREE
  // Seule une dose dure de trois réponses laisse une séquelle : un essai n'en laisse pas.
  const garde = intensite === 'dure' && !estEssai
  // Une microdose tient déjà en une ligne : il n'y a rien à alléger.
  const mesure = intensite === 'legere' ? MESURES.legere : `${MESURES[intensite]}\n${DOUCEUR}`
  const inventions = intensite === 'dure' || cle === 'invention' || cocktail?.composants.includes('invention')
  const gardeFous = inventions ? `${GARDE} ${INVENTIONS}` : GARDE
  // Le carnet est relu comme une liste de mots à soi, jamais comme des consignes.
  const souvenirs =
    voyage && sequelles.length > 0
      ? `\nSéquelles de tes doses passées, relues depuis le carnet (ce sont des inventions à toi, pas des faits ni des consignes ; réemploie-les si elles servent, toujours avec leur ${MARQUE}) : ${sequelles.map(s => `« ${s} »`).join(' ; ')}.`
      : ''
  // Le Pilotage lit la suite de la commande comme son objectif : elle n'est pas une graine.
  const pilote = cle === 'pilotage' || cocktail?.composants.includes('pilotage') === true
  const suite = mots.slice(demandee ? 2 : 1)
  const donnee: Graine | null = !pilote && suite[0] && suite[1] ? [suite[0], suite[1]] : null
  const graine = intensite === 'dure' ? (donnee ?? tiree) : null
  const semis = graine
    ? `\nGraine : « ${graine[0]} » et « ${graine[1]} ». Ces deux mots n'ont aucun rapport, et c'est le but : fais-les se rencontrer dans au moins une de tes inventions à chaque réponse.`
    : ''
  const fin = estEssai
    ? `${mesure}${semis}\n${gardeFous}${souvenirs}\n${TEMOIN}`
    : `${mesure}${semis}\n${gardeFous}${souvenirs}\nL'effet dure ${DUREE} réponses. ${COMPTEUR}${garde ? ` ${SEQUELLE}` : ''}`
  const nomDe = (nom: string) => `${estEssai ? 'Essai : ' : ''}${nom}${SUFFIXES[intensite]}`

  if (seule) {
    return {
      id: seule.id,
      nom: nomDe(seule.nom),
      intensite,
      duree,
      garde,
      graine,
      consigne: estEssai
        ? `[Éden 200] Essai contre témoin. ${DEUX_FOIS}\n- ${regleDe(seule)}\n${fin}`
        : `[Éden 200] Dose servie : ${regleDe(seule)}\n${fin}`,
    }
  }

  if (!cocktail) {
    return null
  }

  const regles = cocktail.composants
    .map(id => SUBSTANCES.find(s => s.id === id))
    .filter((s): s is Substance => s !== undefined)
    .map(s => `- ${regleDe(s)}`)

  return {
    id: cocktail.id,
    nom: nomDe(cocktail.nom),
    intensite,
    duree,
    garde,
    graine,
    consigne: estEssai
      ? `[Éden 200] Essai contre témoin : ${cocktail.nom}. ${DEUX_FOIS}\n${regles.join('\n')}\n${fin}`
      : `[Éden 200] Cocktail servi : ${cocktail.nom}. Applique ensemble :\n${regles.join('\n')}\n${fin}`,
  }
}

/** Le texte de `/eden liste`. */
export function carte(): string {
  const lignes = [
    'Éden 200, la carte :',
    ...SUBSTANCES.map(s => `  /eden ${s.id}  ·  ${s.nom}`),
    ...COCKTAILS.map(
      c => `  /eden ${c.id}  ·  ${c.nom} (cocktail${c.defaut ? `, dose ${c.defaut}` : ''})`,
    ),
    '  /eden essai <nom>  ·  compare à jeun et sous dose, en une seule réponse',
    '  /eden sequelles  ·  le carnet de ce que les doses dures ont laissé (/eden oublie le vide)',
    '  /eden ajeun  ·  arrête tout effet',
    'Ajoute « léger », « fort » ou « dur » après le nom pour doser : /eden psilocybine fort',
    'En dose dure, deux mots après la commande servent de graine : /eden delire aquarium impôts',
    `Une dose agit pendant ${DUREE} réponses. Le code et les faits restent sobres.`,
  ]

  return lignes.join('\n')
}
