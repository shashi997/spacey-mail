import type { Timestamp } from "firebase/firestore";

/**
 * Our own application-level user shape.
 *
 * Components should only ever see this type, never the raw Firebase `User`
 * object. This keeps Firebase-specific fields (providerData, refreshToken,
 * stsTokenManager, etc.) out of the rest of the app and gives us one place
 * to change if we ever swap auth providers or restructure the Firestore
 * user document.
 */
export interface AppUser {
  uid: string;
  email: string | null;
  firstName: string;
  lastName: string;
  photoURL: string | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

/** Shape of the Firestore document at users/{uid}. */
export interface UserDocument {
  firstName: string;
  lastName: string;
  email: string | null;
  photoURL?: string | null;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}