export type Dose = { id: string; nom: string; reste: number }

declare module 'claude-code' {
  interface PluginState {
    eden200: { dose: Dose | null }
  }
}
