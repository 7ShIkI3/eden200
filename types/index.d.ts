/**
 * La dose en cours. `garde` est vrai quand sa dernière réponse doit laisser
 * une séquelle dans le carnet ; absent sur une dose servie par une version
 * plus ancienne, ce qui vaut « non ».
 */
export type Dose = { id: string; nom: string; reste: number; garde?: boolean }

declare module 'claude-code' {
  interface PluginState {
    eden200: { dose: Dose | null }
  }
}
