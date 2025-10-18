// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage"
import { GoogleAuthProvider,signInWithPopup,getAuth 
  ,GithubAuthProvider,FacebookAuthProvider,TwitterAuthProvider
} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuWSkLvnauTggC-sxZhyfC-lqopFs7lZo",
  authDomain: "bhai-f58f8.firebaseapp.com",
  projectId: "bhai-f58f8",
  storageBucket: "bhai-f58f8.appspot.com",
  messagingSenderId: "571237439264",
  appId: "1:571237439264:web:dbda4a7368f41dc5a62945"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const googleprovider = new GoogleAuthProvider();
export const githubprovider = new GithubAuthProvider
export const facebookprovider = new FacebookAuthProvider();
export const twitterprovider= new TwitterAuthProvider();
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app)
export {signInWithPopup};