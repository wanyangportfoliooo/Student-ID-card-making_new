import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PhotoCapturePage from './pages/PhotoCapturePage';
import PersonalInformationPage from './pages/PersonalInformationPage';
import IDCardPreviewPage from './pages/IDCardPreviewPage';

// Main App Component
const App: React.FC = () => {
  return (
    <Router>
    <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Navigate to="/LandingPage" replace />} />
          <Route path="/LandingPage" element={<LandingPage />} />
          <Route path="/PhotoCapture" element={<PhotoCapturePage />} />
          <Route path="/PersonalInformation" element={<PersonalInformationPage />} />
          <Route path="/IDCardPreview" element={<IDCardPreviewPage />} />
        </Routes>
    </div>
    </Router>
  );
};

export default App;
