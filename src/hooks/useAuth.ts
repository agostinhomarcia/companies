import { create } from "zustand";
import { cookieService } from "../services/cookies";
import { AUTH_CREDENTIALS } from "../constants/auth";

interface User {
  username: string;
  lastLogin: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    username: string,
    password: string,
    keepConnected: boolean
  ) => boolean;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (username: string, password: string, keepConnected: boolean) => {
    if (
      username === AUTH_CREDENTIALS.username &&
      password === AUTH_CREDENTIALS.password
    ) {
      const userData = {
        username,
        lastLogin: new Date().toISOString(),
      };

      if (keepConnected) {
        cookieService.setUser(userData);
      } else {
        localStorage.setItem("user", JSON.stringify(userData));
      }

      set({ user: userData, isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => {
    cookieService.removeUser();
    localStorage.removeItem("user");
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const cookieUser = cookieService.getUser();
    const localUser = localStorage.getItem("user");

    if (cookieUser) {
      set({ user: cookieUser, isAuthenticated: true });
      return true;
    } else if (localUser) {
      try {
        const userData = JSON.parse(localUser);
        set({ user: userData, isAuthenticated: true });
        return true;
      } catch {
        set({ user: null, isAuthenticated: false });
        return false;
      }
    }

    set({ user: null, isAuthenticated: false });
    return false;
  },
}));
