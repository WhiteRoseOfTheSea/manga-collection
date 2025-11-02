import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBdiiAEywrNeXnK-FF-GdzGfPXB0XBcvWM",
  authDomain: "manga-collection.firebaseapp.com",
  projectId: "manga-collection-2c3b0",
  storageBucket: "manga-collection-2c3b0.firebasestorage.app",
  messagingSenderId: "577552895309",
  appId: "1:577552895309:web:cce142692964fd36493b04"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);