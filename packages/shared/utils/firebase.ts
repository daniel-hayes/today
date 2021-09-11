import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { getDatabase, ref, child, get, set } from 'firebase/database';
import userStore, { INITIAL_STATE } from '../store/user';

const { VITE_FIREBASE_API_KEY, VITE_FIREBASE_DATABASE_URL } = import.meta.env;
const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  databaseURL: VITE_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase();
const auth = getAuth();

// function writeUserData(userId, name, email, imageUrl) {
//   const db = getDatabase();
//   set(ref(db, 'users/' + userId), {
//     username: name,
//     email: email,
//     profile_picture : imageUrl
//   });
// }

// writeUserData();

// set(ref(database, 'test'), {
//   username: 'name',
// });

// auth.signOut();

export const authStateChanged = () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      userStore.set({ uid: user.uid, email: user.email });
      // make a call to get todos here?
    }
  });
};

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

export const register = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const auth = getAuth();
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  return user;
};

export const login = async ({ email, password }) => {
  const auth = getAuth();
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    console.log(user);
  } catch (e) {
    console.log(e);
  }
};

export const logout = () => {
  auth.signOut();
  userStore.set(INITIAL_STATE);
};

export default app;
