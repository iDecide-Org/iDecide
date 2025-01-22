import React, { createContext, useState, useEffect } from "react";
interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
  type: UserType;
}

// Define the UserType enum
enum UserType {
  STUDENT = "student",
  ADVISOR = "advisor",
}
interface AuthContextType {
  isLoggedIn: boolean;
  isSignedUp: boolean;
  userName: string;
  email: string;
  isLoading: boolean;
  setIsLoggedIn: (value: boolean) => void;
  setUserName: (value: string) => void;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  handleSignup: (data: SignupFormInputs) => Promise<void>; // Add this line
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false); // New state for signup

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
      setIsSignedUp(false);
      setUserName("");
      setEmail("");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSignup = async (data: SignupFormInputs) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      setIsLoggedIn(true);
      setIsSignedUp(true);
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isSignedUp,
        userName,
        email,
        isLoading,
        setIsLoggedIn,
        setUserName,
        handleLogin,
        handleLogout,
        handleSignup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
