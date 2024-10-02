import { atom } from 'recoil';
import { Teacher } from '../types/type';

export const teachersAtom = atom({
  key: 'teachersAtom',
  default: [] as any, // Define Teacher type elsewhere
});
