import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithEmailAndPassword,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { func } from "prop-types";

async function doCreateUserWithEmailAndPassword(email, password, displayName) {
  const auth = getAuth();
  await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(auth.currentUser, {
    displayName: displayName,
  });
}

async function doChangePassword(email, oldPassword, newPassword) {
  const auth = getAuth();
  let credential = EmailAuthProvider.credential(email, oldPassword);
  await reauthenticateWithCredential(auth.currentUser, credential);
  await updatePassword(auth.currentUser, newPassword);
}

async function doSignInWithEmailAndPassword(email, password) {
  const auth = getAuth();
  await signInWithEmailAndPassword(auth, email, password);
}

// async function doGoogleSignIn() {
//   const auth = getAuth();
//   let googleProvider = new GoogleAuthProvider();
//   await signInWithPopup(auth, googleProvider);
// }

async function doPasswordReset(email) {
  const auth = getAuth();
  await sendPasswordResetEmail(auth, email);
}

async function doSignOut() {
  const auth = getAuth();
  await signOut(auth);
}

export {
  doCreateUserWithEmailAndPassword,
  doChangePassword,
  doSignInWithEmailAndPassword,
  // doGoogleSignIn,
  doPasswordReset,
  doSignOut,
};
