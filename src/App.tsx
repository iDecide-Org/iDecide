import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
               <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
            </Routes>
        </BrowserRouter>
    );
};
export default App;