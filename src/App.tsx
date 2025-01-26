import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import UniversitiesPage from "./components/UniversitiesPage";
import ProfilePage from "./components/ProfilePage";
import FeedPage from "./components/FeedPage";
import Chatbot from "./components/Chatbot";
import UniversityDetails from "./components/UniversityDetails";
import About from "./components/About";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/useAuth";
import Jobs from "./components/Jobs";
import JobDetails from "./components/JobDetails";

const App: React.FC = () => {
  const { isLoggedIn, isStudentPendingChatbot, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <FeedPage />
            ) : isStudentPendingChatbot ? (
              <Chatbot />
            ) : (
              <HomePage />
            )
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/universities" element={<UniversitiesPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/chatbot"
          element={
            isLoggedIn || isStudentPendingChatbot ? (
              <Chatbot />
            ) : (
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            )
          }
        />
        <Route path="/university-details" element={<UniversityDetails />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
