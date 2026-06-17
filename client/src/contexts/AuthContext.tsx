import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/config/firebase";
import type { AppUser, UserDocument } from "@/types/user";


// Define the shape of our context
interface AuthContextType {
  /** Our own user shape — never the raw Firebase User object. */
  currentUser: AppUser | null;
  /**
   * True only during the *initial* auth check on app load.
   * Does not block rendering — consumers decide what to do with it
   * (e.g. a <ProtectedRoute> can show a spinner while this is true).
   */
  loading: boolean;
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: {
    firstName?: string;
    lastName?: string;
    photoURL?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Builds our AppUser shape from a Firebase auth user + its Firestore doc.
 * This is the ONLY place in the app that should read raw FirebaseUser
 * fields directly.
 */
const buildAppUser = (
  firebaseUser: FirebaseUser,
  userDoc: UserDocument
): AppUser => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  firstName: userDoc.firstName,
  lastName: userDoc.lastName,
  photoURL: userDoc.photoURL ?? firebaseUser.photoURL,
  createdAt: userDoc.createdAt ?? null,
  updatedAt: userDoc.updatedAt ?? null,
});


/**
 * Fetches the Firestore user doc for a given Firebase user. If it doesn't
 * exist yet (e.g. first-time Google sign-in), creates it. Centralizing
 * this means signup, Google login, and the auth-state listener all share
 * one code path instead of three slightly-different copies.
 */
const getOrCreateUserDocument = async (
  firebaseUser: FirebaseUser,
  fallback: { firstName: string; lastName: string }
): Promise<UserDocument> => {
  const userDocRef = doc(db, "users", firebaseUser.uid);
  const snapshot = await getDoc(userDocRef);
 
  if (snapshot.exists()) {
    return snapshot.data() as UserDocument;
  }
 
  const newUserDoc = {
    firstName: fallback.firstName,
    lastName: fallback.lastName,
    email: firebaseUser.email,
    photoURL: firebaseUser.photoURL,
    createdAt: serverTimestamp(),
  };
 
  await setDoc(
    userDocRef,
    newUserDoc,
    {
      merge:true
    }
  );
 
  // serverTimestamp() resolves on the server; re-fetch so the in-memory
  // value isn't a sentinel placeholder.
  const created = await getDoc(userDocRef);
  return created.data() as UserDocument;
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }
 
      try {
        const userDoc = await getOrCreateUserDocument(firebaseUser, {
          firstName: firebaseUser.displayName?.split(" ")[0] ?? "",
          lastName:
            firebaseUser.displayName?.split(" ").slice(1).join(" ") ?? "",
        });
        setCurrentUser(buildAppUser(firebaseUser, userDoc));
      } catch (error) {
        // If Firestore is unreachable, fail closed rather than leaving
        // the app in a half-authenticated state with no profile data.
        console.error("Failed to load user profile:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });
 
    return unsubscribe;
  }, []);


  // Sign up with Email/Password and save user to Firestore
  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await getOrCreateUserDocument(user, { firstName, lastName });
    // onAuthStateChanged fires from the credential creation above and
    // will pick up the new doc, so we don't need to setCurrentUser here.
  };

  // Log in with Email/Password
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Log in/Sign up with Google
  const loginWithGoogle = async () => {
    const { user } = await signInWithPopup(auth, googleProvider);
    await getOrCreateUserDocument(user, {
      firstName: user.displayName?.split(" ")[0] ?? "",
      lastName: user.displayName?.split(" ").slice(1).join(" ") ?? "",
    });
  };

  // Password reset
  const forgotPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Log out
  const logout = async () => {
    await signOut(auth);
  };

  const updateUserProfile = async (updates: {
    firstName?: string;
    lastName?: string;
    photoURL?: string;
  }) => {
    if (!auth.currentUser) {
      throw new Error("No authenticated user to update.");
    }
 
    const displayNameParts = [updates.firstName, updates.lastName].filter(
      Boolean
    );
 
    // Keep Firebase Auth's built-in profile fields in sync (these power
    // things like auth.currentUser.displayName elsewhere in the SDK).
    if (displayNameParts.length > 0 || updates.photoURL) {
      await updateProfile(auth.currentUser, {
        ...(displayNameParts.length > 0 && {
          displayName: displayNameParts.join(" "),
        }),
        ...(updates.photoURL && { photoURL: updates.photoURL }),
      });
    }
 
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    await setDoc(
      userDocRef,
      { ...updates, updatedAt: serverTimestamp() },
      { merge: true }
    );
 
    // Re-fetch to get the resolved server timestamp, then update local state.
    const updatedDoc = await getDoc(userDocRef);
    setCurrentUser(
      buildAppUser(auth.currentUser, updatedDoc.data() as UserDocument)
    );
  };


  const value:AuthContextType = { currentUser, loading, signup, login, loginWithGoogle, logout, forgotPassword, updateUserProfile };

  // Render children immediately — do NOT gate the whole tree on `loading`.
  // Public routes shouldn't wait on an auth check they don't need, and a
  // <ProtectedRoute>/<RequireAuth> wrapper is the right place to consume
  // `loading` for routes that do.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


// Custom hook to use the auth context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};