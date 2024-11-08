import { ReactNode, useEffect } from "react";
import { create } from "zustand";
import Cookies from "js-cookie";

interface User {
  username: string;
  lastLogin: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, keepConnected: boolean) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (username: string, keepConnected: boolean) => {
    const userData: User = {
      username,
      lastLogin: new Date().toISOString(),
    };

    if (keepConnected) {
      Cookies.set("user", JSON.stringify(userData), { expires: 7 });
    } else {
      localStorage.setItem("user", JSON.stringify(userData));
    }

    set({ user: userData, isAuthenticated: true });
  },

  logout: () => {
    Cookies.remove("user");
    localStorage.removeItem("user");
    set({ user: null, isAuthenticated: false });
  },
}));

interface AuthProviderProps {
  children: ReactNode;
}
export function AuthProvider({ children }: AuthProviderProps) {
  const { login } = useAuthStore();

  useEffect(() => {
    const userFromCookie = Cookies.get("user");
    const userFromStorage = localStorage.getItem("user");

    if (userFromCookie) {
      const userData = JSON.parse(userFromCookie);
      login(userData.username, true);
    } else if (userFromStorage) {
      const userData = JSON.parse(userFromStorage);
      login(userData.username, false);
    }
  }, [login]);

  return <>{children}</>;
}

export const useAuth = useAuthStore;
