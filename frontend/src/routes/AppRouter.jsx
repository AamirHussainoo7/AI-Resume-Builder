/**
 * Application Router — Defines all routes with lazy loading.
 */

import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './ProtectedRoute';
import Loader from '../components/common/Loader';

// Lazy-loaded pages
const Landing = lazy(() => import('../pages/Landing'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const ResumeBuilder = lazy(() => import('../pages/ResumeBuilder'));
const ResumePreview = lazy(() => import('../pages/ResumePreview'));
const Profile = lazy(() => import('../pages/Profile'));

export default function AppRouter() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Suspense fallback={<Loader fullPage />}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />}
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume/new"
          element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume/edit/:id"
          element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume/preview/:id"
          element={
            <ProtectedRoute>
              <ResumePreview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
