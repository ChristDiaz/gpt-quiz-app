// /home/christian/gpt-quiz-app/client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Needed for fetching user data based on token

// 1. Create the Context
const AuthContext = createContext(null);

// Helper function to get token from localStorage
const getToken = () => localStorage.getItem('authToken');

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken()); // Initialize token from localStorage
  const [user, setUser] = useState(null); // Store user details (id, username, email)
  const [isLoading, setIsLoading] = useState(true); // Track initial auth check loading state

  // --- Effect to check token validity or fetch user data on load/token change ---
  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true); // Start loading check
      const storedToken = getToken();

      if (storedToken) {
        setToken(storedToken); // Ensure token state reflects localStorage initially

        // --- OPTION B: Verify token/fetch user data from backend (ACTIVE) ---
        // This is the recommended and more secure approach.
        // It relies on the GET /api/auth/me endpoint created on the backend.
        try {
          // Send token to backend to get user data
          const response = await axios.get('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${storedToken}` }
          });
          // Assuming backend returns { user: { id, username, email, ... } } on success
          setUser(response.data.user);
          console.log("AuthContext: User data fetched successfully.", response.data.user);
        } catch (error) {
          console.error("AuthContext: Failed to fetch user data with token:", error.response?.data?.message || error.message);
          // If token is invalid/expired, backend should return 401
          if (error.response && error.response.status === 401) {
            logout(); // Clear invalid/expired token using the logout function
          } else {
            // Handle other potential errors (e.g., server down) - maybe keep user logged out
            setUser(null);
            setToken(null);
            localStorage.removeItem('authToken'); // Ensure token is cleared on other errors too
          }
        }
        // --- End OPTION B ---

      } else {
        // No token found in localStorage
        setToken(null);
        setUser(null);
      }
      setIsLoading(false); // Finished initial check
    };

    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on initial mount to check localStorage

  // --- Login Function ---
  // Called by Login.jsx after successful API login
  const login = (newToken, userData) => {
    localStorage.setItem('authToken', newToken); // Store token
    setToken(newToken); // Update state
    setUser(userData); // Update user state
    console.log("AuthContext: User logged in.", userData);
  };

  // --- Logout Function ---
  // Called by App.jsx logout button or if token becomes invalid
  const logout = () => {
    localStorage.removeItem('authToken'); // Remove token
    setToken(null); // Clear state
    setUser(null); // Clear user state
    console.log("AuthContext: User logged out");
    // Navigation should be handled by the component calling logout if needed
  };

  // 3. Provide the context values
  const value = {
    token,
    user,
    isLoggedIn: !!user, // Boolean flag derived from user state
    isLoading, // Provide loading status for initial auth check
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Create a custom hook for easy consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // This error means you're trying to use the context outside of its provider
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
