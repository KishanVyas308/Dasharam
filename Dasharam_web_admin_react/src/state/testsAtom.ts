import { atom } from 'recoil';
import { Test } from '../types/type';

export const testsState = atom({
  key: 'testsState',
  default: [] as Test[], // Define Test type elsewhere
});