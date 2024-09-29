import { atom } from 'recoil';
import { Teacher } from '../types/type';

export const teachersState = atom({
  key: 'teachersState',
  default: [] as Teacher[], // Define Teacher type elsewhere
});
