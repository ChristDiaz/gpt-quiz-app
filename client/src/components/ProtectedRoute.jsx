// /home/christian/gpt-quiz-app/client/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * A component to protect routes that require authentication.
 * If the user is logged in, it renders the child route (via <Outlet />).
 * If the user is not logged in, it redirects them to the /login page,
 * preserving the location they were trying to access.
 */
function ProtectedRoute() {
  const { isLoggedIn, isLoading } = useAuth(); // Get login status and loading state from context
  const location = useLocation(); // Get the current location

  // 1. Show loading indicator while initial auth check is happening
  // This prevents a brief flash of the login page if the user is actually logged in
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]"> {/* Adjust height as needed */}
        <p className="text-gray-500 animate-pulse">Checking authentication...</p>
      </div>
    );
  }

  // 2. If logged in, render the requested component
  if (isLoggedIn) {
    return <Outlet />; // Renders the nested child route component
  }

  // 3. If not logged in, redirect to the login page
  //    - `replace` prevents adding the protected route to history, so back button works correctly.
  //    - `state={{ from: location }}` passes the original intended location to the login page,
  //      so it can redirect back after successful login (optional but good UX).
  return <Navigate to="/login" replace state={{ from: location }} />;
}

export default ProtectedRoute;
