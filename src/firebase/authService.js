import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, hasFirebaseConfig } from './firebaseClient';

const DEMO_SESSION_KEY = 'plant-iq-demo-user';
const DEMO_PROFILE = {
  id: 'demo-user',
  name: 'Thu',
  email: 'thu.smartgarden@gmail.com',
  mode: 'demo',
};

const getStoredDemoUser = () => {
  try {
    return JSON.parse(localStorage.getItem(DEMO_SESSION_KEY));
  } catch {
    return null;
  }
};

const setStoredDemoUser = (email) => {
  const user = {
    ...DEMO_PROFILE,
    email: email || DEMO_PROFILE.email,
    name: email ? email.split('@')[0] : DEMO_PROFILE.name,
  };
  localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user));
  return user;
};

const mapFirebaseUser = (user) => ({
  id: user.uid,
  name: user.displayName || user.email?.split('@')[0] || 'User',
  email: user.email,
  mode: 'firebase',
});

export const getCurrentUser = async () => {
  if (!hasFirebaseConfig || !auth) {
    return getStoredDemoUser();
  }

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user ? mapFirebaseUser(user) : null);
    });
  });
};

export const subscribeAuthState = (callback) => {
  if (!hasFirebaseConfig || !auth) {
    return () => {};
  }

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    callback(user ? mapFirebaseUser(user) : null);
  });

  return unsubscribe;
};

export const signIn = async ({ email, password }) => {
  if (!hasFirebaseConfig || !auth) {
    return setStoredDemoUser(email);
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return mapFirebaseUser(userCredential.user);
};

export const signUp = async ({ name, email, password }) => {
  if (!hasFirebaseConfig || !auth) {
    return setStoredDemoUser(email);
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // Update profile with name if needed, here we just return mapped
  return mapFirebaseUser(userCredential.user);
};

export const signInWithProvider = async (providerName) => {
  if (!hasFirebaseConfig || !auth) {
    throw new Error('Cần cấu hình Firebase và bật Auth provider trước khi đăng nhập bằng mạng xã hội.');
  }

  let provider;
  if (providerName === 'google') {
    provider = new GoogleAuthProvider();
  } else {
    throw new Error(`Provider ${providerName} is not supported yet.`);
  }

  const userCredential = await signInWithPopup(auth, provider);
  return mapFirebaseUser(userCredential.user);
};

export const signOut = async () => {
  if (!hasFirebaseConfig || !auth) {
    localStorage.removeItem(DEMO_SESSION_KEY);
    return true;
  }

  await firebaseSignOut(auth);
  return true;
};
