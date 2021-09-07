import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// import firebase from 'firebase/database';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);

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
