// import { writable, get } from 'svelte/store';
// import type { Writable } from 'svelte/store';
// import { getThemes } from '../utils/themes';
// import LocalStore from './localStore';
// import { writeToDb } from '../utils/firebase';
// import userStore from '../store/user';

// export type Todo = {
//   id: string;
//   text: string;
//   checked: boolean;
// };

// export type Variant = 'primary' | 'secondary' | 'accent';

// export type Theme = {
//   title: string;
//   file?: string; // optional due to Custom theme
// } & {
//   [Property in Variant]: string;
// };

// export type Store = {
//   todos: Todo[];
//   theme: Theme;
//   newDay: `${string}:${string}`;
//   updatedAt: Date | null;
//   expires: Date | null;
//   fontSize: number;
// };

// const currentThemes = getThemes();
// const DEFAULT_STATE: Store = {
//   todos: [],
//   theme: currentThemes.find((t) => t.title === 'Dark'),
//   newDay: '00:00',
//   updatedAt: null,
//   expires: null,
//   fontSize: 14,
// };

// class State extends LocalStore<Store> {
//   store: Writable<Store>;

//   private getExpirationTime(newDay?: string): [number, number] {
//     const [hours, minutes] = (newDay ?? get(this.store).newDay).split(':');
//     return [Number(hours), Number(minutes)];
//   }

//   getExpiration(newDay?: string) {
//     const [hours, minutes] = this.getExpirationTime(newDay);
//     const now = new Date();
//     const nowClone = new Date(now.getTime());
//     const expiration = nowClone.setHours(hours, minutes, 0);

//     // if the expiration time is in the past, add 24 hours to get the next day
//     if (now.getTime() > expiration) {
//       return {
//         updatedAt: now,
//         expires: new Date(nowClone.setHours(hours + 24, minutes, 0)),
//       };
//     }

//     return {
//       updatedAt: now,
//       expires: new Date(expiration),
//     };
//   }

//   update(updatedState: Partial<Store>) {
//     const expiration = this.getExpiration(updatedState.newDay);

//     this.store.update((previousState) => ({
//       ...previousState,
//       ...updatedState,
//       ...expiration,
//     }));
//     console.log(updatedState);

//     // ADD DEBOUNCE
//     writeToDb(get(userStore).uid, get(this.store));
//   }

//   // @TODO remove this
//   setTodos(todos: Todo[]) {
//     this.update({
//       todos,
//     });
//   }

//   setupStore() {
//     if (!this.localStore) {
//       this.localStore = DEFAULT_STATE;
//     }

//     const store = writable(this.localStore);

//     // update localStorage whenever state changes
//     store.subscribe((value) => {
//       this.localStore = value;
//     });

//     this.store = store;

//     return store;
//   }
// }

// const state = new State();

// // setup initial state before exporting
// state.setupStore();

// export default state;

import { writable, get } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { getThemes } from '../utils/themes';
import LocalStore from './localStore';
import { readDb, writeToDb } from '../utils/firebase';
import userStore from '../store/user';

export type Todo = {
  id: string;
  text: string;
  checked: boolean;
};

export type Variant = 'primary' | 'secondary' | 'accent';

export type Theme = {
  title: string;
  file?: string; // optional due to Custom theme
} & {
  [Property in Variant]: string;
};

export type Store = {
  todos: Todo[];
  theme: Theme;
  newDay: `${string}:${string}`;
  updatedAt: Date | null;
  expires: Date | null;
  fontSize: number;
};

const currentThemes = getThemes();
const DEFAULT_STATE: Store = {
  todos: [],
  theme: currentThemes.find((t) => t.title === 'Dark'),
  newDay: '00:00',
  updatedAt: null,
  expires: null,
  fontSize: 14,
};

class State {
  store: Writable<Store>;

  constructor() {
    this.store = writable(DEFAULT_STATE);
  }

  private getExpirationTime(newDay?: string): [number, number] {
    const [hours, minutes] = (newDay ?? get(this.store).newDay).split(':');
    return [Number(hours), Number(minutes)];
  }

  getExpiration(newDay?: string) {
    const [hours, minutes] = this.getExpirationTime(newDay);
    const now = new Date();
    const nowClone = new Date(now.getTime());
    const expiration = nowClone.setHours(hours, minutes, 0);

    // if the expiration time is in the past, add 24 hours to get the next day
    if (now.getTime() > expiration) {
      return {
        updatedAt: now,
        expires: new Date(nowClone.setHours(hours + 24, minutes, 0)),
      };
    }

    return {
      updatedAt: now,
      expires: new Date(expiration),
    };
  }

  update(updatedState: Partial<Store>) {
    const expiration = this.getExpiration(updatedState.newDay);

    this.store.update((previousState) => ({
      ...previousState,
      ...updatedState,
      ...expiration,
    }));

    console.log('updated');
  }

  // @TODO remove this
  setTodos(todos: Todo[]) {
    this.update({
      todos,
    });
  }

  setupStore(uid: string) {
    this.store.subscribe((value) => {
      // this.localStore = value;

      console.log(value);

      // ADD DEBOUNCE
      // writeToDb(get(userStore).uid, value);
      writeToDb(uid, value);

      console.log(get(this.store), 'HDHDHDHDH');
    });
  }
}

const state = new State();

// // setup initial state before exporting
// state.setupStore();

export default state;

// import { writable, get } from 'svelte/store';
// import type { Writable } from 'svelte/store';
// import { getThemes } from '../utils/themes';
// import LocalStore from './localStore';
// import { readDb, writeToDb } from '../utils/firebase';
// import userStore from '../store/user';

// export type Todo = {
//   id: string;
//   text: string;
//   checked: boolean;
// };

// export type Variant = 'primary' | 'secondary' | 'accent';

// export type Theme = {
//   title: string;
//   file?: string; // optional due to Custom theme
// } & {
//   [Property in Variant]: string;
// };

// export type Store = {
//   todos: Todo[];
//   theme: Theme;
//   newDay: `${string}:${string}`;
//   updatedAt: Date | null;
//   expires: Date | null;
//   fontSize: number;
// };

// const currentThemes = getThemes();
// const DEFAULT_STATE: Store = {
//   todos: [],
//   theme: currentThemes.find((t) => t.title === 'Dark'),
//   newDay: '00:00',
//   updatedAt: null,
//   expires: null,
//   fontSize: 14,
// };

// export const store = writable(DEFAULT_STATE);

// store.subscribe((value) => {
//   // this.localStore = value;

//   console.log(value, 'do it');

//   // ADD DEBOUNCE
//   writeToDb(get(userStore).uid, value);
// });

// console.log(get(store), 'ho');
// class State extends LocalStore<Store> {
//   private getExpirationTime(newDay?: string): [number, number] {
//     const [hours, minutes] = (newDay ?? get(store).newDay).split(':');
//     return [Number(hours), Number(minutes)];
//   }

//   getExpiration(newDay?: string) {
//     const [hours, minutes] = this.getExpirationTime(newDay);
//     const now = new Date();
//     const nowClone = new Date(now.getTime());
//     const expiration = nowClone.setHours(hours, minutes, 0);

//     // if the expiration time is in the past, add 24 hours to get the next day
//     if (now.getTime() > expiration) {
//       return {
//         updatedAt: now,
//         expires: new Date(nowClone.setHours(hours + 24, minutes, 0)),
//       };
//     }

//     return {
//       updatedAt: now,
//       expires: new Date(expiration),
//     };
//   }

//   update(updatedState: Partial<Store>) {
//     const expiration = this.getExpiration(updatedState.newDay);

//     store.update((previousState) => ({
//       ...previousState,
//       ...updatedState,
//       ...expiration,
//     }));

//     console.log('updated');
//   }

//   // @TODO remove this
//   setTodos(todos: Todo[]) {
//     this.update({
//       todos,
//     });
//   }
// }

// const state = new State();

// // // setup initial state before exporting
// // state.setupStore();

// export default state;
