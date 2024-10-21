import { atom } from 'recoil';
import { User } from '../types/type';

export const userAtom = atom({
  key: 'userAtom',
  default: null as User | null, // Define Student type elsewhere
});



