import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import UniversitiesPage from "./UniversitiesPage";
import ProfilePage from "./ProfilePage";
import FeedPage from "./FeedPage";
import Chatbot from "./Chatbot";
import UniversityDetails from "./UniversityDetails";
import { AuthProvider } from "./AuthContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/universities" element={<UniversitiesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/university-details" element={<UniversityDetails />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
export default App;
