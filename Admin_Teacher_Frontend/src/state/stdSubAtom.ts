import { atom } from 'recoil';
import { Subject } from '../types/type';

export const stdSubAtom = atom({
  key: 'stdSubAtom',
  default: [] as any, // Define Subject type elsewhere

});