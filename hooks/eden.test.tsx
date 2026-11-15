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
  expect(servie.context?.[0]).toContain('relis à jeun chaque fait')
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

test('une dose forte ajoute le voyage et la ligne « En clair »', async ($, on) => {
  on('command.register', () => ({ value: { command: 'eden' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const forte = await $.command.run(eden('psilocybine fort'))
  expect(forte.text).toBe(
    'Éden 200 : Psilocybine de synthèse (dose forte), pour 3 réponses. /eden ajeun pour arrêter.',
  )
  expect(forte.context?.[0]).toContain('Voyage : Les associations débordent.')
  expect(forte.context?.[0]).toContain('des yeux dans les accolades')
  expect(forte.context?.[0]).toContain('« En clair : … »')
  expect(forte.context?.[0]).toContain('« Descente : … »')
  expect(forte.context?.[0]).toContain('restent exacts et sobres')

  const ui = await $.ui.mount({ ...BANDE, surface: 'desktop' })
  expect((await ui.find({ type: 'Text', text: /Éden 200/ }))?.text).toContain('(dose forte) · encore 3 réponses')
  await ui.unmount()
})

test('une microdose tient en une ligne, et une dose normale ne contient pas le voyage', async ($, on) => {
  on('command.register', () => ({ value: { command: 'eden' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const micro = await $.command.run(eden('Rêve léger'))
  expect(micro.text).toContain('Rêve profond (microdose)')
  expect(micro.context?.[0]).toContain('en une seule ligne, discrète')
  expect(micro.context?.[0]).not.toContain('Voyage :')

  const normale = await $.command.run(eden('reve'))
  expect(normale.text).toContain('Rêve profond, pour 3 réponses')
  expect(normale.context?.[0]).not.toContain('Voyage :')
})

test('/eden paradis sert la dose forte sans qu’on la demande', async ($, on) => {
  on('command.register', () => ({ value: { command: 'eden' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const paradis = await $.command.run(eden('paradis'))
  expect(paradis.text).toBe('Éden 200 : Le Paradis (dose forte), pour 3 réponses. /eden ajeun pour arrêter.')
  expect(paradis.context?.[0]).toContain('Béatitude. Émerveillement.')
  expect(paradis.context?.[0]).toContain('finit dans un calme complet')
  expect(paradis.context?.[0]).toContain('aucune flatterie de la personne')
  expect(paradis.context?.[0]).toContain('restent exacts et sobres')

  // « léger » l'emporte sur l'intensité d'office.
  const doux = await $.command.run(eden('paradis léger'))
  expect(doux.text).toContain('Le Paradis (microdose)')
  expect(doux.context?.[0]).not.toContain('Voyage :')

  const carte = await $.command.run(eden('liste'))
  expect(carte.text).toContain('/eden paradis  ·  Le Paradis (cocktail, dose forte)')
  expect(carte.text).toContain('/eden beatitude  ·  Béatitude')
})

test("l'intensité ne mange pas l'objectif du pilotage", async ($, on) => {
  on('command.register', () => ({ value: { command: 'eden' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const servie = await $.command.run(eden('pilotage fort finir la migration'))
  expect(servie.context?.[0]).toContain('Un seul objectif compte : finir la migration.')
  expect(servie.context?.[0]).toContain('obsession joyeuse')
})

test('le pilotage prend son objectif dans la suite de la commande', async ($, on) => {
  on('command.register', () => ({ value: { command: 'eden' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const servie = await $.command.run(eden('pilotage finir la migration'))
  expect(servie.context?.[0]).toContain('Un seul objectif compte : finir la migration.')
})
