
'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { initializeFirebase } from '@/firebase';
import { createUserProfile } from './client-actions';

const { auth } = initializeFirebase();
const googleProvider = new GoogleAuthProvider();

// Sign up with email and password
export async function signUpWithEmail(email: string, password: string, firstName: string, lastName: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // After creating the user, create their profile in Firestore
    await createUserProfile(user.uid, {
        displayName: `${firstName} ${lastName}`,
        email: user.email,
        avatarUrl: user.photoURL
    });

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error };
  }
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error };
  }
}

// Sign in with Google
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
     await createUserProfile(user.uid, {
        displayName: user.displayName,
        email: user.email,
        avatarUrl: user.photoURL
    });
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error };
  }
}

// Sign out
export async function signOutUser() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error };
  }
}

// Password Reset
export async function sendPasswordReset(email: string) {
    try {
        await sendPasswordResetEmail(auth, email);
        return { error: null };
    } catch (error: any) {
        return { error };
    }
}
