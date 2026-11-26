import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { ProfileProvider } from './context/ProfileContext';
import Layout from './components/Layout';
import ConsentGate from './components/ConsentGate';
import Onboarding from './pages/Onboarding';
import Evidence from './pages/Evidence';
import Dashboard from './pages/Dashboard';
import FairJobMatch from './pages/FairJobMatch';
import JdChecker from './pages/JdChecker';
import AiReadinessAndSap from './pages/AiReadinessAndSap';
import Profile from './pages/Profile';
import FresherTrack from './pages/FresherTrack';
import EmployedTrack from './pages/EmployedTrack';

export default function App() {
  return (
    <AccessibilityProvider>
      <ProfileProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/onboarding" replace />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/fresher" element={<FresherTrack />} />
            <Route path="/employed" element={<EmployedTrack />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/evidence" element={<Evidence />} />
            <Route
              path="/dashboard"
              element={
                <ConsentGate>
                  <Dashboard />
                </ConsentGate>
              }
            />
            <Route path="/matches" element={<FairJobMatch />} />
            <Route path="/jd-checker" element={<JdChecker />} />
            <Route path="/sap-view" element={<AiReadinessAndSap />} />
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </Routes>
        </Layout>
      </ProfileProvider>
    </AccessibilityProvider>
  );
}
