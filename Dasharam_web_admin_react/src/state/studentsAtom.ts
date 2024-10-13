import { atom } from 'recoil';
import { Student } from '../types/type';

export const studentsAtom = atom({
  key: 'studentsAtom',
  default: [] as Student[], // Define Student type elsewhere
});



