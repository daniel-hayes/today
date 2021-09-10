import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import './firebase';

// const auth = getAuth();
// createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ..
//   });

// const createUserProfile = (userProfile) =>
//   db.collection('profiles').doc(userProfile.uid).set(userProfile);

// export const getUserProfile = (uid) =>
//   db
//     .collection('profiles')
//     .doc(uid)
//     .get()
//     .then((snanpshot) => snanpshot.data());

export const register = async ({ email, password, username, avatar }) => {
  const auth = getAuth();

  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  const userProfile = {
    uid: user.uid,
    username,
    email,
    avatar,
    joinedChats: [],
  };
  //   await createUserProfile(userProfile);
  return userProfile;
};

export const login = async ({ email, password }) => {
  const auth = getAuth();
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    console.log(user);
  } catch (e) {
    console.log(e);
  }

  //   const { user } = await firebase
  //     .auth()
  //     .signInWithEmailAndPassword(email, password);
  //   const userProfile = await getUserProfile(user.uid);
  //   return userProfile;
};

// export const logout = () => firebase.auth().signOut();

// export const onAuthStateChanges = (onAuth) =>
//   firebase.auth().onAuthStateChanged(onAuth);
