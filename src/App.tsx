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
import { AuthProvider } from "./contexts/AuthContext";
import About from "./components/About";

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
          <Route path="/about" element={<About />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/university-details" element={<UniversityDetails />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
export default App;
