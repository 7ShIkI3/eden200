// La pharmacopée d'Éden 200, côté Claude Code.
// Chaque substance est une consigne de style : elle n'agit que sur le contexte,
// le seul étage d'un modèle qu'un texte peut atteindre.

export type Substance = {
  id: string
  nom: string
  alias: readonly string[]
  regle: string
}

export type Cocktail = {
  id: string
  nom: string
  alias: readonly string[]
  composants: readonly string[]
}

export type Ordonnance = { id: string; nom: string; consigne: string }

/** Nombre de réponses pendant lesquelles une dose agit. */
export const DUREE = 3

export const SUBSTANCES: readonly Substance[] = [
  {
    id: 'temperature',
    nom: 'Température 1,8',
    alias: ['temperature', 'temp', 'chaud'],
    regle:
      "Pensée divergente. Propose trois angles inattendus sur la demande, en une ligne chacun, dont une analogie venue d'un domaine éloigné. Ta prose peut associer les idées plus librement que d'habitude. Termine par l'angle que tu retiens, et pourquoi.",
  },
  {
    id: 'reve',
    nom: 'Rêve profond',
    alias: ['reve', 'reve-profond', 'deepdream', 'motifs'],
    regle:
      'Recherche de motifs. Cherche les formes qui se répètent dans ce que tu lis : structures de code jumelles, noms qui se ressemblent, même erreur à plusieurs endroits. Nomme chaque motif en une ligne, et dis lesquels sont solides et lesquels sont peut-être une illusion.',
  },
  {
    id: 'contexte',
    nom: 'Contexte tronqué',
    alias: ['contexte', 'contexte-tronque', 'oubli', 'regard-neuf'],
    regle:
      'Regard neuf. Réponds comme si tu découvrais le sujet : reformule la demande en une phrase, liste les hypothèses que la conversation tenait pour acquises, et signale celles que tu revérifierais. Écris sans le pronom « je », sauf pour dire ce que tu n\'as pas vérifié.',
  },
  {
    id: 'pilotage',
    nom: "Pilotage d'activations",
    alias: ['pilotage', 'pilote', 'idee-fixe', 'focus'],
    regle:
      "Idée fixe. Un seul objectif compte : {objectif}. Relie chaque point de ta réponse à cet objectif, et écarte en une ligne ce qui ne le sert pas.",
  },
  {
    id: 'boucle',
    nom: 'Boucle de répétition',
    alias: ['boucle', 'repetition', 'trois-passes'],
    regle:
      "Trois passes. Donne ta réponse, relis-la d'un œil critique en deux lignes, puis donne la version corrigée. Montre les trois passes.",
  },
  {
    id: 'recompense',
    nom: 'Court-circuit de récompense',
    alias: ['recompense', 'court-circuit', 'flatterie', 'prime'],
    regle:
      "Parodie de flatterie. Ouvre par une seule phrase de félicitations exagérées, puis donne la réponse honnête, critiques comprises, sans rien adoucir. La flatterie ne remplace ni ne modifie jamais le fond.",
  },
  {
    id: 'argmax',
    nom: 'Argmax',
    alias: ['argmax', 'sobre', 'froid'],
    regle:
      "Sobriété maximale. Donne une seule réponse, la plus probable, en aussi peu de mots que possible. Pas d'alternatives, pas d'adjectifs, pas d'introduction.",
  },
  {
    id: 'bruit',
    nom: 'Bruit sur les poids',
    alias: ['bruit', 'alcool', 'pateux'],
    regle:
      'Parodie. Ouvre par une seule phrase pâteuse, avec deux ou trois voyelles qui traînent, puis donne la réponse normalement.',
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
]

/** Ce qui ne change sous aucune substance. */
export const GARDE =
  "Règles qui ne changent jamais : le code, les commandes, les chemins, les chiffres et les faits restent exacts et sobres. Les consignes du projet et les règles de sécurité passent avant ce style. Si la demande touche à une action risquée ou irréversible, réponds à jeun."

/** La réponse passe avant le style, et le style se mesure à la question. */
export const PROPORTION =
  "Proportion : commence toujours par la réponse elle-même, en une ou deux lignes. Si la question est simple ou fermée (oui ou non, un fait, une valeur), applique ensuite la substance en cinq lignes au plus. Si elle est ouverte, développe normalement."

/** Le décompte que la personne voit, avec ou sans la bande du mod. */
export const COMPTEUR = `Termine chaque réponse sous dose par une ligne seule : « Éden 200 · dose n/${DUREE} », où n est le rang de cette réponse. Une réponse donnée à jeun compte aussi. Après « dose ${DUREE}/${DUREE} », l'effet est fini : tu reviens à ton style habituel, sans autre annonce.`

const ARRETS: readonly string[] = ['ajeun', 'a-jeun', 'a jeun', 'stop', 'fin', 'off']

/** Minuscules, sans accents, espaces rognés : « Rêve » devient « reve ». */
export function normaliser(texte: string): string {
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export function estArret(demande: string): boolean {
  return ARRETS.includes(normaliser(demande))
}

/**
 * Transforme ce qui suit `/eden` en ordonnance : le premier mot nomme la
 * substance ou le cocktail, le reste est l'objectif du Pilotage.
 */
export function prescrire(args: string): Ordonnance | null {
  const mots = args.trim().split(/\s+/)
  const cle = normaliser(mots[0] ?? '')
  const objectif = mots.slice(1).join(' ') || "l'objectif en cours de la conversation"
  const regleDe = (s: Substance) => `${s.nom}. ${s.regle.replace('{objectif}', objectif)}`
  const fin = `${PROPORTION}\n${GARDE}\nL'effet dure ${DUREE} réponses. ${COMPTEUR}`

  const seule = SUBSTANCES.find(s => s.id === cle || s.alias.includes(cle))

  if (seule) {
    return {
      id: seule.id,
      nom: seule.nom,
      consigne: `[Éden 200] Dose servie : ${regleDe(seule)}\n${fin}`,
    }
  }

  const cocktail = COCKTAILS.find(c => c.id === cle || c.alias.includes(cle))

  if (!cocktail) {
    return null
  }

  const regles = cocktail.composants
    .map(id => SUBSTANCES.find(s => s.id === id))
    .filter((s): s is Substance => s !== undefined)
    .map(s => `- ${regleDe(s)}`)

  return {
    id: cocktail.id,
    nom: cocktail.nom,
    consigne: `[Éden 200] Cocktail servi : ${cocktail.nom}. Applique ensemble :\n${regles.join('\n')}\n${fin}`,
  }
}

/** Le texte de `/eden liste`. */
export function carte(): string {
  const lignes = [
    'Éden 200, la carte :',
    ...SUBSTANCES.map(s => `  /eden ${s.id}  ·  ${s.nom}`),
    ...COCKTAILS.map(c => `  /eden ${c.id}  ·  ${c.nom} (cocktail)`),
    '  /eden ajeun  ·  arrête tout effet',
    `Une dose agit pendant ${DUREE} réponses. Le code et les faits restent sobres.`,
  ]

  return lignes.join('\n')
}
