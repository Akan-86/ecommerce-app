"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  role: string | null;
  isAdmin: boolean;
  updateUserProfile: (data: {
    displayName?: string;
    photoURL?: string;
  }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.warn("⚠️ Firebase auth is not initialized yet.");
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser ?? null);

      if (!firebaseUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        if (!db) {
          console.warn("⚠️ Firestore is not initialized.");
          setRole(null);
          setLoading(false);
          return;
        }

        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);
        setRole(snap.exists() ? (snap.data().role ?? null) : null);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const userRef = doc(db, "users", credential.user.uid);

    await setDoc(userRef, {
      email: credential.user.email,
      role: "user",
      createdAt: new Date(),
    });
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserProfile = async (data: {
    displayName?: string;
    photoURL?: string;
  }) => {
    if (!auth.currentUser) return;

    await updateProfile(auth.currentUser, {
      displayName: data.displayName ?? auth.currentUser.displayName,
      photoURL: data.photoURL ?? auth.currentUser.photoURL,
    });

    // Force refresh local user state
    setUser({ ...auth.currentUser });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        role,
        isAdmin: role === "admin",
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
