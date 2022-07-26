export const Status = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

export type Status = typeof Status[keyof typeof Status];
