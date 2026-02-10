import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ResumeProvider } from './context/ResumeContext';
import { JobsProvider } from './context/JobsContext';
import { Router } from './components/Router';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ResumeProvider>
          <JobsProvider>
            <Router />
          </JobsProvider>
        </ResumeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
