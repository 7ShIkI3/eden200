import { expect, test } from 'claude-code/testing'

const BANDE = {
  plugin: 'eden200',
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isCollapsed: false,
    isWorking: false,
    maxRows: 4,
    bodyColumns: 80,
    scroll: { offset: 0, bodyRows: 4 },
    view: {},
  },
} as const

// `/eden <args>`, comme si la personne l'avait tapé dans la zone de saisie.
const eden = (args: string) =>
  ({
    command: 'eden',
    args,
    origin: { kind: 'composer' },
    presentation: { isFullscreen: false, columns: 80 },
  }) as const

test('une dose est servie, comptée dans la bande, puis arrêtée', async ($, on) => {
  // Rien ne tourne sous le mod : ces hooks tiennent lieu de moteur.
  on('command.register', () => ({ value: { command: 'eden' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const servie = await $.command.run(eden('Psilocybine'))
  expect(servie.text).toBe('Éden 200 : Psilocybine de synthèse, pour 3 réponses. /eden ajeun pour arrêter.')
  expect(servie.context?.[0]).toContain('Température 1,8')
  expect(servie.context?.[0]).toContain('restent exacts et sobres')
  // La réponse passe avant le style, et le décompte s'écrit dans la réponse.
  expect(servie.context?.[0]).toContain('commence toujours par la réponse elle-même')
  expect(servie.context?.[0]).toContain('en cinq lignes au plus')
  expect(servie.context?.[0]).toContain('« Éden 200 · dose n/3 »')
  expect(servie.context?.[0]).toContain('sauf pour dire ce que tu n\'as pas vérifié')

  const ui = await $.ui.mount({ ...BANDE, surface: 'desktop' })
  const ligne = await ui.find({ type: 'Text', text: /Éden 200/ })
  expect(ligne?.text).toContain('Psilocybine de synthèse · encore 3 réponses')
  await ui.unmount()

  const arret = await $.command.run(eden('ajeun'))
  expect(arret.text).toBe('Éden 200 : à jeun.')
})

test('une substance inconnue est refusée sans rien servir', async ($, on) => {
  on('command.register', () => ({ value: { command: 'eden' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const refus = await $.command.run(eden('cafeine'))
  expect(refus.text).toContain('substance inconnue « cafeine »')
  expect(refus.context).toBeUndefined()
})

test('la dose se décompte à chaque réponse, puis disparaît de la bande', async ($, on) => {
  on('command.register', () => ({ value: { command: 'eden' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('turn.complete', (_, e) => ({ text: e.answer }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  await $.command.run(eden('argmax'))

  const fin = { answer: 'ok', durationMs: 10, isAborted: false, reason: 'answer' } as const
  await $.turn.complete({ ...fin, turnId: 't1' })

  const apresUne = await $.ui.mount({ ...BANDE, surface: 'desktop' })
  expect((await apresUne.find({ type: 'Text', text: /Éden 200/ }))?.text).toContain('Argmax · encore 2 réponses')
  await apresUne.unmount()

  // Le tour d'un sous-agent ne compte pas.
  await $.turn.complete({ ...fin, turnId: 't2', agentId: 'a1' })
  await $.turn.complete({ ...fin, turnId: 't3' })
  await $.turn.complete({ ...fin, turnId: 't4' })

  const apresTrois = await $.ui.mount({ ...BANDE, surface: 'desktop' })
  expect(await apresTrois.find({ type: 'Text', text: /Éden 200/ })).toBeUndefined()
  await apresTrois.unmount()
})

test('le pilotage prend son objectif dans la suite de la commande', async ($, on) => {
  on('command.register', () => ({ value: { command: 'eden' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const servie = await $.command.run(eden('pilotage finir la migration'))
  expect(servie.context?.[0]).toContain('Un seul objectif compte : finir la migration.')
})
