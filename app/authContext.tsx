"use client";

import {
  ReactNode,
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase/client";

export type UserType = User | null;

export type AuthContextProps = {
  userInfo: UserType;
};

export type AuthProps = {
  children: ReactNode;
};

const AuthContext = createContext<Partial<AuthContextProps>>({});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProps) => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserType>(null);
  const value = {
    userInfo,
  };

  useEffect(() => {
    const authStateChanged = onAuthStateChanged(auth, async (user) => {
      setUserInfo(user);
      !user && (await router.push("/login"));
    });
    return () => {
      authStateChanged();
    };
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
