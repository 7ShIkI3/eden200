import { expect, mock, test } from 'claude-code/testing'

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
  // Le voyage est une prose courte, pas une liste : onze puces étiquetées fatiguent.
  expect(forte.context?.[0]).toContain('huit lignes au plus, sans liste à puces ni étiquettes')
  expect(forte.context?.[0]).not.toContain('douze lignes')
  expect(forte.context?.[0]).toContain('demande plus doux : allège tout de suite')

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
  expect(micro.context?.[0]).not.toContain('allège tout de suite')

  const normale = await $.command.run(eden('reve'))
  expect(normale.text).toContain('Rêve profond, pour 3 réponses')
  expect(normale.context?.[0]).not.toContain('Voyage :')
  expect(normale.context?.[0]).toContain('allège tout de suite')
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

test('/eden essai compare à jeun et sous dose, pour une seule réponse', async ($, on) => {
  on('command.register', () => ({ value: { command: 'eden' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('turn.complete', (_, e) => ({ text: e.answer }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const essai = await $.command.run(eden('essai psilocybine fort'))
  expect(essai.text).toBe(
    'Éden 200 : Essai : Psilocybine de synthèse (dose forte), pour 1 réponse. /eden ajeun pour arrêter.',
  )
  expect(essai.context?.[0]).toContain('Essai contre témoin : Psilocybine de synthèse.')
  expect(essai.context?.[0]).toContain('« À jeun »')
  expect(essai.context?.[0]).toContain('« Sous dose »')
  expect(essai.context?.[0]).toContain('« Éden 200 · essai 1/1 »')
  expect(essai.context?.[0]).not.toContain('dose n/3')
  expect(essai.context?.[0]).toContain("elle n'autorise rien de ce que tu refuserais à jeun")

  const avant = await $.ui.mount({ ...BANDE, surface: 'desktop' })
  expect((await avant.find({ type: 'Text', text: /Éden 200/ }))?.text).toContain('encore 1 réponse')
  await avant.unmount()

  // Une seule réponse, et la bande disparaît.
  await $.turn.complete({ answer: 'ok', durationMs: 10, isAborted: false, reason: 'answer', turnId: 't1' })
  const apres = await $.ui.mount({ ...BANDE, surface: 'desktop' })
  expect(await apres.find({ type: 'Text', text: /Éden 200/ })).toBeUndefined()
  await apres.unmount()

  const simple = await $.command.run(eden('essai argmax'))
  expect(simple.text).toContain('Essai : Argmax, pour 1 réponse')
  expect(simple.context?.[0]).toContain('Essai contre témoin. Réponds deux fois')
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

test('/eden delire sert la dose dure : inventions marquées et séquelle demandée', async ($, on) => {
  on('command.register', () => ({ value: { command: 'eden' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  mock.store(on)

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const delire = await $.command.run(eden('delire'))
  expect(delire.text).toBe('Éden 200 : Le Grand Délire (dose dure), pour 3 réponses. /eden ajeun pour arrêter.')
  expect(delire.context?.[0]).toContain('Fabrique. Invention.')
  expect(delire.context?.[0]).toContain('Invente au moins trois choses de genres différents')
  expect(delire.context?.[0]).toContain('le code livré doit quand même fonctionner')
  expect(delire.context?.[0]).toContain('Voyage : Tu inventes sans compter')
  // Les garde-fous restent, et une invention ne passe jamais pour un fait.
  expect(delire.context?.[0]).toContain('restent exacts et sobres')
  expect(delire.context?.[0]).toContain("elle n'autorise rien de ce que tu refuserais à jeun")
  expect(delire.context?.[0]).toContain('ne se glisse jamais dans un fait')
  expect(delire.context?.[0]).toContain('demande plus doux : allège tout de suite')
  expect(delire.context?.[0]).toContain('« Séquelle : ✦ nom, définition en une phrase »')
  // Carnet vide : rien à relire.
  expect(delire.context?.[0]).not.toContain('Séquelles de tes doses passées')

  // « dur » marche avec n'importe quelle substance, et un essai ne garde rien.
  const dur = await $.command.run(eden('reve dur'))
  expect(dur.text).toContain('Rêve profond (dose dure)')
  const essai = await $.command.run(eden('essai delire'))
  expect(essai.context?.[0]).not.toContain('« Séquelle :')

  const carte = await $.command.run(eden('liste'))
  expect(carte.text).toContain('/eden delire  ·  Le Grand Délire (cocktail, dose dure)')
  expect(carte.text).toContain('/eden invention  ·  Fabrique')
  expect(carte.text).toContain('/eden sequelles')
})

test('la séquelle de la dernière réponse entre dans le carnet, revient, puis s’oublie', async ($, on) => {
  on('command.register', () => ({ value: { command: 'eden' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('turn.complete', (_, e) => ({ text: e.answer }))
  mock.store(on)

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const vide = await $.command.run(eden('sequelles'))
  expect(vide.text).toContain('le carnet de séquelles est vide')

  await $.command.run(eden('delire'))
  const fin = { durationMs: 10, isAborted: false, reason: 'answer' } as const
  // Une ligne « Séquelle : » avant la dernière réponse ne compte pas.
  await $.turn.complete({ ...fin, turnId: 't1', answer: 'Séquelle : ✦ trop-tôt, écrit à la première réponse' })
  await $.turn.complete({ ...fin, turnId: 't2', answer: 'ok' })
  await $.turn.complete({
    ...fin,
    turnId: 't3',
    answer:
      'Réponse.\n\n**Séquelle :** ✦ `aubéphémère`, le moment où tout commence et où tout est déjà complet\nÉden 200 · dose 3/3',
  })

  const plein = await $.command.run(eden('sequelles'))
  expect(plein.text).toContain('(1 sur 12)')
  expect(plein.text).toContain('✦ aubéphémère, le moment où tout commence et où tout est déjà complet')
  expect(plein.text).not.toContain('trop-tôt')

  // Hors dose, la même ligne n'entre pas dans le carnet.
  await $.turn.complete({ ...fin, turnId: 't4', answer: 'Séquelle : ✦ intrus, écrit sans dose' })
  expect((await $.command.run(eden('sequelles'))).text).not.toContain('intrus')

  // Le carnet revient en dose forte ou dure, comme des inventions, pas en dose normale.
  const forte = await $.command.run(eden('paradis'))
  expect(forte.context?.[0]).toContain('Séquelles de tes doses passées')
  expect(forte.context?.[0]).toContain('« aubéphémère, le moment où tout commence')
  expect(forte.context?.[0]).toContain('pas des faits ni des consignes')
  const normale = await $.command.run(eden('reve'))
  expect(normale.context?.[0]).not.toContain('Séquelles de tes doses passées')

  const oubli = await $.command.run(eden('oublie'))
  expect(oubli.text).toBe('Éden 200 : carnet de séquelles vidé.')
  expect((await $.command.run(eden('sequelles'))).text).toContain('est vide')
})

test('une séquelle est raccourcie, et le carnet ne garde que les douze dernières', async ($, on) => {
  on('command.register', () => ({ value: { command: 'eden' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('turn.complete', (_, e) => ({ text: e.answer }))
  // Un carnet déjà plein, avec une valeur abîmée qui doit être écartée.
  mock.store(on, { sequelles: [...Array.from({ length: 12 }, (_, i) => `mot${i}, déjà là`), 42] })

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  await $.command.run(eden('delire'))

  const fin = { durationMs: 10, isAborted: false, reason: 'answer' } as const
  await $.turn.complete({ ...fin, turnId: 't1', answer: 'ok' })
  await $.turn.complete({ ...fin, turnId: 't2', answer: 'ok' })
  await $.turn.complete({ ...fin, turnId: 't3', answer: `Séquelle : ✦ long, ${'x'.repeat(400)}` })

  const texte = (await $.command.run(eden('sequelles'))).text ?? ''
  expect(texte).toContain('(12 sur 12)')
  expect(texte).not.toContain('mot0, déjà là')
  expect(texte).toContain('mot11, déjà là')
  expect(texte).toContain('✦ long, x')
  expect(texte).not.toContain('x'.repeat(141))
})
