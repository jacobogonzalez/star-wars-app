export const ApiResource = {
  Planets: 'planets',
  People: 'people',
  Films: 'films'
} as const;

export type ApiResource = typeof ApiResource[keyof typeof ApiResource];