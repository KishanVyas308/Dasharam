import { atom } from 'recoil';

export const teastsAtom = atom({
  key: 'teastsAtom',
  default: [] as any, // Define Test type elsewhere
});