import { atom } from 'recoil';
import { Admin } from '../types/type';

export const currentAdminState = atom({
  key: 'currentAdminState',
  default: null as Admin | null, // Define Student type elsewhere
});



