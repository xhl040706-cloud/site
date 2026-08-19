export const PARTICLE_FIELD_VARIANTS = [
  'ember',
  'horizon',
  'ribbon',
  'vortex',
  'collaboration',
  'delivery',
  'knowledge',
  'governance',
  'closing',
] as const

export type ParticleFieldVariant = (typeof PARTICLE_FIELD_VARIANTS)[number]

export const HOME_PARTICLE_FIELD_VARIANTS = [
  'collaboration',
  'delivery',
  'knowledge',
  'governance',
] as const satisfies readonly ParticleFieldVariant[]

export type HomeParticleFieldVariant = (typeof HOME_PARTICLE_FIELD_VARIANTS)[number]
