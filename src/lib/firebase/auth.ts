
'use client';

import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import { initializeFirebase } from '@/firebase';
import { createUserProfile } from './client-actions';

const { auth } = initializeFirebase();
const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user };
  } catch (error: any) {
    return { error };
  }
}

export async function signUpWithEmail(email: string, password: string,firstName: string, lastName: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (result.user) {
        await createUserProfile(result.user.uid, {
          memberEmailAddress: email,
          displayName: `${firstName} ${lastName}`,
          memberFirstName: firstName,
          memberLastName: lastName,
        });
      }
      return { user: result.user };
    } catch (error: any) {
      return { error };
    }
  }

export async function signInWithEmail(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user };
  } catch (error: any) {
    return { error };
  }
}

export async function sendPasswordReset(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return {};
  } catch (error: any) {
    return { error };
  }
}

export async function signOutUser() {
  await signOut(auth);
}
