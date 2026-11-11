export const StateOfState = ['active', 'inactive'] as const;
export type StateOfState = (typeof StateOfState)[number];