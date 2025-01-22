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

  stundentExists: boolean;
  userName: string;
  email: string;
  isLoading: boolean;
  setIsLoggedIn: (value: boolean) => void;
  setUserName: (value: string) => void;
  handleLogin: (
    email: string,
    password: string
  ) => Promise<"STUDENT_EXISTS" | "LOGGED_IN">;
  handleLogout: () => Promise<void>;
  handleSignup: (data: SignupFormInputs) => Promise<void>; // Add this line
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //user state for the user of type student that create or login to the app but not complete the chatbot
  const [stundentExists, SetstundentExists] = useState(false);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // const setChatbotCompleted = async (status: boolean) => {
  //   try {
  //     const response = await fetch(
  //       "http://localhost:3000/auth/chatbot-status",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         credentials: "include",
  //         body: JSON.stringify({ status }),
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Update chatbot status failed");
  //     }

  //     setChatbotCompletedState(status);
  //   } catch (error) {
  //     console.error("Error updating chatbot status:", error);
  //     throw error;
  //   }
  // };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/auth/user", {
        credentials: "include",
      });

      if (response.ok) {
        const user = await response.json();

        if (user.type === UserType.STUDENT && user.chatbotCompleted) {
          setIsLoggedIn(true);

          setUserName(user.name);
          setEmail(user.email);
        } else if (user.type === UserType.STUDENT && !user.chatbotCompleted) {
          SetstundentExists(true);
        } else if (user.type === UserType.ADVISOR) {
          setIsLoggedIn(true);
          setUserName(user.name);
          setEmail(user.email);
        }

        return user;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setIsLoggedIn(false);
      SetstundentExists(false);
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogin = async (email: string, password: string) => {
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

      const user = await fetchUser();

      return user.type === UserType.STUDENT && !user.chatbotCompleted
        ? "STUDENT_EXISTS"
        : "LOGGED_IN";
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsLoggedIn(false);

      SetstundentExists(false); // Reset stundentExists
      setUserName("");
      setEmail("");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSignup = async (data: SignupFormInputs) => {
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

      // Set stundentExists for students
      if (data.type === UserType.STUDENT) {
        SetstundentExists(true);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,

        stundentExists,
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
