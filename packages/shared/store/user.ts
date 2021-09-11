import { writable } from 'svelte/store';

export type Store = {
  email: string | null;
  uid: string | null;
  //   paid: false;
};

export const INITIAL_STATE: Store = {
  email: null,
  uid: null,
};

const store = writable(INITIAL_STATE);

export default store;
