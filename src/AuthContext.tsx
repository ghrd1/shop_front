import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authAPI, usersAPI } from "./api";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  useEffect(() => {
    if (token) {
      // Fetch user profile on mount if token exists
      usersAPI
        .getProfile()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
        });
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    const { token } = response.data;
    localStorage.setItem("token", token);
    setToken(token);

    // Fetch user profile after login
    const userResponse = await usersAPI.getProfile();
    setUser(userResponse.data);
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => {
    const response = await authAPI.register(
      email,
      password,
      firstName,
      lastName,
    );
    const { token } = response.data;
    localStorage.setItem("token", token);
    setToken(token);

    const userResponse = await usersAPI.getProfile();
    setUser(userResponse.data);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (_error) {
      // Ignore server logout errors and always clear local auth state.
    }

    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isAuthenticated, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
