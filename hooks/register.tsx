import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Dose } from '../types'
import {
  ajouterSequelle,
  carnet,
  carte,
  estArret,
  estCarnet,
  estOubli,
  extraireSequelle,
  lireCarnet,
  normaliser,
  prescrire,
  tirerGraine,
} from './substances'

// La dose en cours : quelle substance, et combien de réponses il lui reste.
const dose = atom({ plugin: 'eden200', key: 'dose' } as const, null)

// Le carnet de séquelles : le seul effet qui dure d'une session à l'autre.
// C'est un fichier du plugin sur ce poste, pas une modification du modèle.
const CARNET = 'sequelles'

// Un carnet illisible ne doit jamais empêcher de servir une dose : il compte pour vide.
const vide = () => undefined

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'eden',
      description: 'Éden 200 : sert une substance à Claude pour trois réponses',
      argumentHint: '[essai | une] [substance] [léger | fort | dur] | sequelles | oublie | ajeun | liste',
    })

    return next(e)
  })

  on('command.run', { command: 'eden' }, async ($, e) => {
    const demande = normaliser(e.args)

    if (demande === '' || demande === 'liste') {
      return { text: carte() }
    }

    if (estArret(demande)) {
      await update($, dose, () => null)

      return {
        text: 'Éden 200 : à jeun.',
        context: [
          "[Éden 200] Les effets sont terminés. Reprends ton style habituel dès maintenant, sans l'annoncer.",
        ],
      }
    }

    if (estCarnet(demande)) {
      return { text: carnet(lireCarnet(await $.store.get(CARNET).catch(vide))) }
    }

    if (estOubli(demande)) {
      await $.store.delete(CARNET)

      return { text: 'Éden 200 : carnet de séquelles vidé.' }
    }

    const ordonnance = prescrire(
      e.args,
      lireCarnet(await $.store.get(CARNET).catch(vide)),
      // Le vrai hasard vient du code : un modèle seul retombe sur les mêmes mots.
      tirerGraine(Math.random),
    )

    if (ordonnance === null) {
      return {
        text: `Éden 200 : substance inconnue « ${e.args.trim()} ». Tape /eden liste pour voir la carte.`,
      }
    }

    const servie: Dose = {
      id: ordonnance.id,
      nom: ordonnance.nom,
      reste: ordonnance.duree,
      garde: ordonnance.garde,
    }
    await update($, dose, () => servie)
    const pour = ordonnance.duree > 1 ? `${ordonnance.duree} réponses` : '1 réponse'
    const semee = ordonnance.graine ? ` Graine : ${ordonnance.graine[0]} + ${ordonnance.graine[1]}.` : ''

    return {
      text: `Éden 200 : ${ordonnance.nom}, pour ${pour}.${semee} /eden ajeun pour arrêter.`,
      // Ce que Claude lit et que la personne ne voit pas : la consigne de style.
      context: [ordonnance.consigne],
    }
  })

  on('turn.complete', async ($, e, next) => {
    // Seules les réponses de la conversation principale comptent.
    const estUneReponse = e.agentId === undefined && !e.isAborted && e.answer !== ''
    const enCours = estUneReponse ? await read($, dose) : null

    if (enCours !== null) {
      const reste = enCours.reste - 1
      await update($, dose, () => (reste > 0 ? { ...enCours, reste } : null))

      // La séquelle ne se lit que sur la dernière réponse d'une dose dure :
      // une ligne « Séquelle : » écrite ailleurs n'entre jamais dans le carnet.
      const sequelle = reste <= 0 && enCours.garde === true ? extraireSequelle(e.answer) : null

      if (sequelle !== null) {
        await $.store.set(CARNET, ajouterSequelle(lireCarnet(await $.store.get(CARNET).catch(vide)), sequelle))
      }

      if (reste <= 0) {
        $.ui.toast(
          sequelle === null
            ? 'Éden 200 : descente terminée, à jeun.'
            : 'Éden 200 : descente terminée. Une séquelle est gardée dans le carnet.',
        )
      }
    }

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const enCours = await read($, dose)

    if (e.props.hasSurvey || enCours === null) {
      return next(e)
    }

    const { Box, Text } = $.ui.resolve(e)
    const restant = enCours.reste > 1 ? `${enCours.reste} réponses` : '1 réponse'

    return (
      <Box>
        <Text dimColor>
          Éden 200 · {enCours.nom} · encore {restant} · /eden ajeun pour arrêter
        </Text>
      </Box>
    )
  })
}
