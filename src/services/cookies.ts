import Cookies from "js-cookie";

interface UserData {
  username: string;
  lastLogin: string;
}

const COOKIE_USER_KEY = "user";
const COOKIE_EXPIRATION_DAYS = 7;

export const cookieService = {
  setUser: (userData: UserData) => {
    Cookies.set(COOKIE_USER_KEY, JSON.stringify(userData), {
      expires: COOKIE_EXPIRATION_DAYS,
      sameSite: "strict",
    });
  },

  getUser: (): UserData | null => {
    const userData = Cookies.get(COOKIE_USER_KEY);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  },

  removeUser: () => {
    Cookies.remove(COOKIE_USER_KEY);
  },

  hasUser: (): boolean => {
    return !!Cookies.get(COOKIE_USER_KEY);
  },
};
