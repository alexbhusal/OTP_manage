import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";




const firebaseConfig = {
  apiKey: "AIzaSyC9p-WCZXDjQ_QCjFrtt3uJ7B6xRsdi_lU",
  authDomain: "lms-otp-de38c.firebaseapp.com",
  projectId: "lms-otp-de38c",
  storageBucket: "lms-otp-de38c.firebasestorage.app",
  messagingSenderId: "978913178317",
  appId: "1:978913178317:web:d11cbd3ba482d1224cef84",
  measurementId: "G-6YKCF1425E"
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
