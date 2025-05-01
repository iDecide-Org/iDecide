import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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
const AdvisorDashboard = React.lazy(
  () => import("./components/advisor/Dashboard")
) as unknown as React.ComponentType;

const AddUniversity = React.lazy(
  () => import("./components/advisor/university/AddUniversity")
) as unknown as React.ComponentType;

const ManageUniversities = React.lazy(
  () => import("./components/advisor/ManageUniversities")
) as unknown as React.ComponentType;

const EditUniversity = React.lazy(
  () => import("./components/advisor/university/EditUniversity")
) as unknown as React.ComponentType;

const AddScholarship = React.lazy(
  () => import("./components/advisor/scholarship/AddScholarship")
) as unknown as React.ComponentType;

const EditScholarship = React.lazy(
  () => import("./components/advisor/scholarship/EditScholarship")
) as unknown as React.ComponentType;

const AddCollege = React.lazy(
  () => import("./components/advisor/collages/AddCollege") // Corrected path
) as unknown as React.ComponentType;
const EditCollege = React.lazy(
  () => import("./components/advisor/collages/EditCollege") // Corrected path
) as unknown as React.ComponentType;

const AddMajor = React.lazy(
  () => import("./components/advisor/majors/AddMajor") // Corrected path
) as unknown as React.ComponentType;

const EditMajor = React.lazy(
  () => import("./components/advisor/majors/EditMajor") // Corrected path
) as unknown as React.ComponentType;

const ChatList = React.lazy(
  () => import("./components/chat/ChatList")
) as unknown as React.ComponentType;

const ChatRoom = React.lazy(
  () => import("./components/chat/ChatRoom")
) as unknown as React.ComponentType;

import "./App.css";

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
      <Router>
        {/* Sticky Chat Button  */}
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
            <Route path="/universities/edit/:id" element={<EditUniversity />} />

            <Route
              path="/scholarships/add/:universityId"
              element={<AddScholarship />}
            />
            <Route
              path="/scholarships/edit/:id"
              element={<EditScholarship />}
            />
            <Route path="/scholarships/:id" element={<ScholarshipDetails />} />
            <Route
              path="/colleges/add/:universityId"
              element={<AddCollege />}
            />
            <Route path="/colleges/edit/:id" element={<EditCollege />} />

            <Route path="/majors/add/:collegeId" element={<AddMajor />} />
            <Route path="/majors/edit/:id" element={<EditMajor />} />


            <Route path="/about" element={<About />} />
            <Route path="/chat" element={<ChatList />} />
            <Route path="/chat/:userId" element={<ChatRoom />} />
            <Route
              path="/university-details/:id"
              element={<UniversityDetails />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </React.Suspense>
      </Router>
    );
  }

  // Student or not logged in routes (the original routes)
  return (
    <Router>
      {/* Sticky Chat Button for logged-in students (not pending chatbot) */}
      {isLoggedIn && !isStudentPendingChatbot && (
        <Link
          to="/chat"
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          aria-label="Open Chats"
        >
          <MessageSquare size={24} />
        </Link>
      )}
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
    </Router>
  );
};

export default App;
