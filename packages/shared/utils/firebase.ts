import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { getDatabase, ref, child, get, set } from 'firebase/database';
import state from '../store/state';
import userStore, { INITIAL_STATE } from '../store/user';

const { VITE_FIREBASE_API_KEY, VITE_FIREBASE_DATABASE_URL } = import.meta.env;
const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  databaseURL: VITE_FIREBASE_DATABASE_URL,
};

initializeApp(firebaseConfig);

const database = getDatabase();

export const authStateChanged = () => {
  const auth = getAuth();

  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      console.log('called');

      try {
        if (user) {
          const { uid, email } = user;
          const remoteData = await readDb(uid);

          state.setupStore(uid);

          console.log(remoteData);
          state.update(remoteData);

          userStore.set({ uid, email });

          resolve(remoteData);
        }

        console.log(user, 'USER');

        resolve('user is not found or is not logged in');
      } catch (e) {
        reject(e);
      }
    });
  });
};

export const register = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const auth = getAuth();
  await createUserWithEmailAndPassword(auth, email, password);
};

export const login = async ({ email, password }) => {
  const auth = getAuth();
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    return 'Error signing in. Please try a different email or password';
  }
};

export const logout = () => {
  const auth = getAuth();
  auth.signOut();
  userStore.set(INITIAL_STATE);
};

/* DB Queries */

export const writeToDb = async (uid: string, data: any) => {
  try {
    const result = await set(ref(database, `users/${uid}/state`), data);
    return result;
  } catch (e) {
    return e;
  }
};

export const readDb = async (uid: string) => {
  try {
    const result = await get(child(ref(database), `users/${uid}/state`));
    if (result.exists()) {
      return result.val();
    }

    return null;
  } catch (e) {
    return e;
  }
};

// export default app;
