import { atom } from 'recoil';

export const testsState = atom({
  key: 'testsState',
  default: [] as any, // Define Test type elsewhere
});