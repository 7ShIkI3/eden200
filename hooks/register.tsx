import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Dose } from '../types'
import { carte, estArret, normaliser, prescrire } from './substances'

// La dose en cours : quelle substance, et combien de réponses il lui reste.
const dose = atom({ plugin: 'eden200', key: 'dose' } as const, null)

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'eden',
      description: 'Éden 200 : sert une substance à Claude pour trois réponses',
      argumentHint: '[essai] [substance] [léger | fort] | ajeun | liste',
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

    const ordonnance = prescrire(e.args)

    if (ordonnance === null) {
      return {
        text: `Éden 200 : substance inconnue « ${e.args.trim()} ». Tape /eden liste pour voir la carte.`,
      }
    }

    const servie: Dose = { id: ordonnance.id, nom: ordonnance.nom, reste: ordonnance.duree }
    await update($, dose, () => servie)
    const pour = ordonnance.duree > 1 ? `${ordonnance.duree} réponses` : '1 réponse'

    return {
      text: `Éden 200 : ${ordonnance.nom}, pour ${pour}. /eden ajeun pour arrêter.`,
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

      if (reste <= 0) {
        $.ui.toast('Éden 200 : descente terminée, à jeun.')
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
