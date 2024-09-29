import { atom } from 'recoil';

export const subjectsState = atom({
  key: 'subjectsState',
  default: [] as Subject[], // Define Subject type elsewhere
});