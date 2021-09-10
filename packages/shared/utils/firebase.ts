import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import firebase from 'firebase/database';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

const { VITE_FIREBASE_API_KEY, VITE_FIREBASE_DATABASE_URL } = import.meta.env;
const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  databaseURL: VITE_FIREBASE_DATABASE_URL,
};

// const app = initializeApp(firebaseConfig);

export default initializeApp(firebaseConfig);

// console.log(db);

// // Get a list of cities from your database
// async function getCities(db) {
//   const citiesCol = collection(db, 'cities');
//   const citySnapshot = await getDocs(citiesCol);
//   const cityList = citySnapshot.docs.map((doc) => doc.data());
//   return cityList;
// }

// export async function signInUserWithGoogle() {
//   return await signInWithRedirect(getAuth(), new GoogleAuthProvider());
// }
