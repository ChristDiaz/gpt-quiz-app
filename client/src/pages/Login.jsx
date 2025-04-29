// /home/christian/gpt-quiz-app/client/src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // 1. Import useLocation
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // 2. Get location object
  const { login } = useAuth();

  // --- Define Consistent Styles ---
  const inputBaseClasses = "border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-[#2980b9] focus:border-transparent disabled:bg-gray-100";
  const primaryButtonClasses = "w-full bg-[#2980b9] text-white px-4 py-2 rounded hover:bg-[#2573a6] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2573a6] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  // --- End Styles ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });

      if (response.data.token && response.data.user) {
        // Call context login function
        login(response.data.token, response.data.user);
        console.log('Login successful, context updated.');

        // --- Redirect Logic ---
        // 3. Determine where to redirect FROM
        // Check if state and state.from exist, otherwise default to dashboard
        const fromPathname = location.state?.from?.pathname || "/dashboard";
        console.log('Redirecting to:', fromPathname);

        // 4. Navigate to the intended page or dashboard
        // Use replace: true to replace the /login route in history
        navigate(fromPathname, { replace: true });

      } else {
         setError('Login successful, but missing token or user data in response.');
         console.error("Login response missing token or user data:", response.data);
      }

    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <PageHeader title="Log In" />

      <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 rounded bg-red-100 text-red-700 border border-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputBaseClasses}
              disabled={loading}
              required
              autoComplete="email"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputBaseClasses}
              disabled={loading}
              required
              autoComplete="current-password"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className={primaryButtonClasses}
              disabled={loading}
            >
              {loading ? (
                <> {/* Loading Spinner */}
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Logging In...
                </>
              ) : (
                'Log In'
              )}
            </button>
          </div>
        </form>

        {/* Link to Signup */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-[#2980b9] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
