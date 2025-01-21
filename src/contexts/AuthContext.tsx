// AuthContext.tsx
import React, { createContext, useState, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  email: string;
  isLoading: boolean;
  setIsLoggedIn: (value: boolean) => void;
  setUserName: (value: string) => void;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3000/auth/user", {
          credentials: "include",
        });

        if (response.ok) {
          const user = await response.json();
          setIsLoggedIn(true);
          setUserName(user.name);
          setEmail(user.email);
        } else {
          setIsLoggedIn(false);
          setUserName("");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [isLoggedIn]);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsLoggedIn(false);
      setUserName("");
      setEmail("");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userName,
        email,
        isLoading,
        setIsLoggedIn,
        setUserName,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
