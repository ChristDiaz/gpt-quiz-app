// /home/christian/gpt-quiz-app/client/src/pages/MyAttempts.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Optional: Link back to quizzes
import { ListChecks, AlertCircle, Loader2 } from 'lucide-react'; // Icons
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext'; // To get the token

function MyAttempts() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, isLoggedIn } = useAuth(); // Get token and login status

  useEffect(() => {
    // Only fetch if user is logged in and token exists
    if (!isLoggedIn || !token) {
      setError("Please log in to view your quiz attempts.");
      setLoading(false);
      return;
    }

    const fetchAttempts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/quiz-attempts/my-attempts', {
          headers: {
            'Authorization': `Bearer ${token}` // Send token for authentication
          }
        });
        setAttempts(response.data || []);
      } catch (err) {
        console.error('Error fetching quiz attempts:', err);
        setError(err.response?.data?.message || 'Failed to load your quiz attempts.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [token, isLoggedIn]); // Re-fetch if token or login status changes

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // Helper function to calculate percentage
  const calculatePercentage = (score, total) => {
    if (total === 0 || score === undefined || total === undefined) return 0;
    return Math.round((score / total) * 100);
  };

  return (
    <div className="p-8">
      <PageHeader title="My Quiz Attempts" />

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-10 text-gray-500">
          <Loader2 className="animate-spin mr-2 h-5 w-5" />
          <span>Loading attempts...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center text-red-600 bg-red-100 p-4 rounded border border-red-300">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* Attempts List - Only show if not loading and no error */}
      {!loading && !error && (
        <div className="mt-6 bg-white shadow border border-gray-200 rounded-lg overflow-hidden">
          {attempts.length === 0 ? (
            <div className="text-center text-gray-500 p-10">
              <ListChecks className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p>You haven't completed any quizzes yet.</p>
              <Link to="/study" className="mt-4 inline-block text-blue-600 hover:underline">
                Start Studying!
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {attempts.map((attempt) => {
                const percentage = calculatePercentage(attempt.score, attempt.totalQuestions);
                return (
                  <li key={attempt._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      {/* Left Side: Title and Date */}
                      <div>
                        <p className="text-lg font-semibold text-[#2980b9] truncate" title={attempt.quizTitle}>
                          {attempt.quizTitle}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Completed: {formatDate(attempt.completedAt)}
                        </p>
                      </div>
                      {/* Right Side: Score */}
                      <div className="text-right flex-shrink-0 mt-2 sm:mt-0">
                        <p className="text-xl font-bold text-gray-700">
                          {attempt.score} / {attempt.totalQuestions}
                        </p>
                        <p className={`text-sm font-medium ${percentage >= 70 ? 'text-green-600' : percentage >= 40 ? 'text-orange-500' : 'text-red-600'}`}>
                          ({percentage}%)
                        </p>
                        {/* Optional: Link to view detailed attempt (requires another route/component) */}
                        {/* <Link to={`/attempts/${attempt._id}`} className="text-xs text-blue-500 hover:underline mt-1">Details</Link> */}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default MyAttempts;
