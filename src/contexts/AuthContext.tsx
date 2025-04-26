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
  ADMIN = "admin", // Add admin type
}

interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  token?: string;
  chatbotCompleted?: boolean;
  // ...other optional profile fields...
  password?: string;
  dateOfBirth?: string;
  government?: string;
  district?: string;
  city?: string;
  phoneNumber?: string;
  gender?: string;
  preferredCommunication?: string;
  certificateType?: string;
  totalScore?: number;
  nationality?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isStudentPendingChatbot: boolean;
  user: User | null; // User object or null if not logged in
  userName: string;
  email: string;
  isLoading: boolean;
  userType: UserType | null; // Add user type to context
  isAdvisor: boolean; // Helper flag to easily check if user is an advisor
  setIsLoggedIn: (value: boolean) => void;
  setUserName: (value: string) => void;
  handleLogin: (
    email: string,
    password: string
  ) => Promise<"STUDENT_EXISTS" | "LOGGED_IN">;
  handleLogout: () => Promise<void>;
  handleSignup: (data: SignupFormInputs) => Promise<void>;
  setIsStudentPendingChatbot: (value: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchUser: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isStudentPendingChatbot, setIsStudentPendingChatbot] = useState(false);
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<UserType | null>(null); // New state for user type
  const [isAdvisor, setIsAdvisor] = useState(false); // New state to easily check if user is advisor

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/auth/user", {
        credentials: "include",
      });
      if (response.status === 401) {
        console.log("[Expected] User not authenticated");
        setIsLoading(false);
        return;
      }

      if (response.ok) {
        const fetchedUser = await response.json();
        console.log('[AuthContext] User fetched successfully:', fetchedUser); // Log fetched user
        setUser(fetchedUser);

        // Store user type regardless of type
        setUserType(fetchedUser.type);

        if (fetchedUser.type === UserType.STUDENT && fetchedUser.chatbotCompleted) {
          console.log('[AuthContext] Setting state for logged-in student.'); // Log state change
          setIsLoggedIn(true);
          setUserName(fetchedUser.name);
          setEmail(fetchedUser.email);
          setIsAdvisor(false);
        } else if (fetchedUser.type === UserType.STUDENT && !fetchedUser.chatbotCompleted) {
          console.log('[AuthContext] Setting state for student pending chatbot.'); // Log state change
          setIsStudentPendingChatbot(true);
          setIsAdvisor(false);
        } else if (fetchedUser.type === UserType.ADVISOR) {
          console.log('[AuthContext] Setting state for logged-in advisor.'); // Log state change
          setIsLoggedIn(true);
          setUserName(fetchedUser.name);
          setEmail(fetchedUser.email);
          setIsAdvisor(true); // Set advisor flag
        } else if (fetchedUser.type === UserType.ADMIN) {
          setIsLoggedIn(true);
          setUserName(fetchedUser.name);
          setEmail(fetchedUser.email);
          setIsAdvisor(false);
        }

        return fetchedUser;
      }
    } catch (error) {
      console.error("[AuthContext] Error fetching user:", error); // Log error
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/signin", {
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
    setIsLoading(true);
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsLoggedIn(false);

      setIsStudentPendingChatbot(false);
      setUserName("");
      setEmail("");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupFormInputs) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
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

      if (data.type === UserType.STUDENT) {
        setIsStudentPendingChatbot(true);
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
        isStudentPendingChatbot,
        user,
        userName,
        email,
        isLoading,
        userType, // Add user type to context
        isAdvisor, // Add advisor flag to context
        setIsLoggedIn,
        setUserName,
        handleLogin,
        handleLogout,
        handleSignup,
        setIsStudentPendingChatbot,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
