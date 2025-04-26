import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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
import NotFoundPage from "./components/NotFoundPage";
import Scholarships from "./components/Scholarships";
import ScholarshipDetails from "./components/ScholarshipDetails";
import { MessageSquare } from "lucide-react";

// Import advisor-specific components
// Use type assertion to help TypeScript understand these are valid React components
const AdvisorDashboard = React.lazy(
  () => import("./components/advisor/Dashboard")
) as unknown as React.ComponentType;

const AddUniversity = React.lazy(
  () => import("./components/advisor/AddUniversity")
) as unknown as React.ComponentType;

const ManageUniversities = React.lazy(
  () => import("./components/advisor/ManageUniversities")
) as unknown as React.ComponentType;

// Add new advisor components
const EditUniversity = React.lazy(
  () => import("./components/advisor/EditUniversity")
) as unknown as React.ComponentType;

const ChatList = React.lazy(
  () => import("./components/chat/ChatList")
) as unknown as React.ComponentType;

const ChatRoom = React.lazy(
  () => import("./components/chat/ChatRoom")
) as unknown as React.ComponentType;

const App: React.FC = () => {
  const { isLoggedIn, isStudentPendingChatbot, isLoading, isAdvisor } =
    useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render different route sets based on user type
  if (isLoggedIn && isAdvisor) {
    // Advisor routes
    return (
      <BrowserRouter>
        {/* Sticky Chat Button for Advisors */}
        <Link
          to="/chat"
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          aria-label="Open Chats"
        >
          <MessageSquare size={24} />
        </Link>
        <React.Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<AdvisorDashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/universities/add" element={<AddUniversity />} />
            <Route
              path="/universities/manage"
              element={<ManageUniversities />}
            />
            <Route 
              path="/universities/edit/:id" 
              element={<EditUniversity />} 
            />
            <Route path="/about" element={<About />} />
            <Route path="/chat" element={<ChatList />} />
            <Route path="/chat/:userId" element={<ChatRoom />} />
            <Route path="/university-details/:id" element={<UniversityDetails />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    );
  }

  // Student or not logged in routes (the original routes)
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
        <Route path="/university-details/:id" element={<UniversityDetails />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/scholarships" element={<Scholarships />} />
        <Route path="/scholarships/:id" element={<ScholarshipDetails />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <React.Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                }
              >
                <ChatList />
              </React.Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:userId"
          element={
            <ProtectedRoute>
              <React.Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                }
              >
                <ChatRoom />
              </React.Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
