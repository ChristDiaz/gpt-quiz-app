import { useState, useEffect, useRef } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  PencilLine,
  Timer,
  User, // Keep for potential future Profile link
  Settings, // Keep for potential future Settings link
  LogIn, // Icon for Login
  UserPlus, // Icon for Signup
  LogOut, // Icon for Logout
  ListChecks // Icon for My Attempts
} from "lucide-react";
import { useAuth } from "./context/AuthContext"; // Import useAuth

// Page Imports
import Dashboard from "./pages/Dashboard";
import Study from "./pages/Study";
import CreateQuiz from "./pages/CreateQuiz";
import TimedQuizzes from "./pages/TimedQuizzes";
import ViewQuizzes from "./pages/ViewQuizzes";
import ViewQuiz from "./pages/ViewQuiz";
import EditQuiz from "./pages/EditQuiz";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import MyAttempts from "./pages/MyAttempts"; // Import MyAttempts page

// Component Imports
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

// index.css is minimal; all styling handled here with Tailwind.

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const collapseTimer = useRef(null);
  const navigate = useNavigate(); // For potential navigation on logout

  // Use the Auth context
  const { isLoggedIn, logout, isLoading: isAuthLoading } = useAuth(); // Get state and functions

  // Sidebar handlers
  const handleMouseEnter = () => {
    clearTimeout(collapseTimer.current);
    if (!sidebarOpen) {
      setSidebarOpen(true);
    }
  };

  const handleMouseLeave = () => {
    clearTimeout(collapseTimer.current);
    collapseTimer.current = setTimeout(() => {
      setSidebarOpen(false);
    }, 300);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearTimeout(collapseTimer.current);
  }, []);

  // Styling constants
  const mainContentMargin = sidebarOpen ? "14rem" : "4rem";
  const sidebarTextClass = `whitespace-nowrap overflow-hidden transition-[opacity,max-width,margin-left] duration-200 ease-in-out delay-100 ${sidebarOpen ? 'opacity-100 max-w-xs ml-3' : 'opacity-0 max-w-0 ml-0'}`;
  const sidebarTitleClass = `whitespace-nowrap overflow-hidden font-semibold text-3xl text-gray-600 transition-[opacity,max-width,margin-left] duration-200 ease-in-out delay-100 ${sidebarOpen ? 'opacity-100 max-w-xs ml-2' : 'opacity-0 max-w-0 ml-0'}`;
  const sidebarIconClass = `opacity-100 flex-shrink-0`;
  const baseNavLinkClasses = "flex items-center px-3 py-2 rounded w-full transition-colors duration-150";
  const inactiveNavLinkClasses = "text-gray-600 hover:bg-[#2980b9] hover:text-white";
  const activeNavLinkClasses = "bg-[#e0f2fe] text-[#2980b9] font-semibold border-l-4 border-[#2980b9] pl-2";

  // Logout Handler
  const handleLogout = () => {
     logout(); // Call the function from context
     navigate('/login'); // Navigate to login after logout
     console.log("User logged out via button");
  };

  // Initial Auth Loading Indicator
  if (isAuthLoading) {
      return (
          <div className="flex justify-center items-center h-screen bg-gray-100">
              <p className="text-gray-500 animate-pulse text-lg">Loading Application...</p>
          </div>
      );
  }


  return (
    <div className="h-screen w-full flex bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 overflow-y-auto flex flex-col justify-between transition-[width,padding] duration-300 ease-in-out ${sidebarOpen ? 'w-56 p-4' : 'w-16 p-2'}`}
      >
        {/* Top Section (Logo & Main Nav) */}
        <div className="flex flex-col gap-4 w-full">
          {/* Logo */}
          <div className={`flex items-center mb-6 h-12`}>
            <img src="/logo.png" alt="Logo" className={`transition-opacity ease-in-out duration-300 drop-shadow-md h-10 w-auto ${sidebarOpen ? "opacity-100" : "opacity-70"}`} />
            <span className={sidebarTitleClass}>QuizCraft</span>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-2">
            {/* Public Link */}
            <NavLink to="/dashboard" className={({ isActive }) => `${baseNavLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}>
              <LayoutDashboard size={20} className={sidebarIconClass} />
              <span className={sidebarTextClass}>Dashboard</span>
            </NavLink>
            {/* Conditionally render links that require login */}
            {isLoggedIn && (
              <>
                <NavLink to="/study" className={({ isActive }) => `${baseNavLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}>
                  <BookOpen size={20} className={sidebarIconClass} />
                  <span className={sidebarTextClass}>Study</span>
                </NavLink>
                <NavLink to="/create-quiz" className={({ isActive }) => `${baseNavLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}>
                  <PencilLine size={20} className={sidebarIconClass} />
                  <span className={sidebarTextClass}>Create Quiz</span>
                </NavLink>
                <NavLink to="/view-quizzes" className={({ isActive }) => `${baseNavLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}>
                  <BookOpen size={20} className={sidebarIconClass} />
                  <span className={sidebarTextClass}>View Quizzes</span>
                </NavLink>
                <NavLink to="/timed-quizzes" className={({ isActive }) => `${baseNavLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}>
                  <Timer size={20} className={sidebarIconClass} />
                  <span className={sidebarTextClass}>Timed Quizzes</span>
                </NavLink>
                {/* NavLink for My Attempts */}
                <NavLink to="/my-attempts" className={({ isActive }) => `${baseNavLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}>
                  <ListChecks size={20} className={sidebarIconClass} />
                  <span className={sidebarTextClass}>My Attempts</span>
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* Bottom Section (Auth & Settings) */}
        <div className="flex flex-col gap-2 mt-8 border-t border-gray-200 pt-4 w-full">
           {/* Use isLoggedIn from context for conditional rendering */}
           {!isLoggedIn ? (
             <>
               <NavLink to="/login" className={({ isActive }) => `${baseNavLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses} text-sm`}>
                 <LogIn size={18} className={sidebarIconClass} />
                 <span className={sidebarTextClass}>Login</span>
               </NavLink>
               <NavLink to="/signup" className={({ isActive }) => `${baseNavLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses} text-sm`}>
                 <UserPlus size={18} className={sidebarIconClass} />
                 <span className={sidebarTextClass}>Sign Up</span>
               </NavLink>
             </>
           ) : (
             <>
               {/* Logout Button */}
               <button onClick={handleLogout} className={`${baseNavLinkClasses} ${inactiveNavLinkClasses} text-sm w-full text-left`}>
                 <LogOut size={18} className={sidebarIconClass} />
                 <span className={sidebarTextClass}>Logout</span>
               </button>
             </>
           )}
        </div>
      </aside>

      {/* Main content */}
      <main
        className="flex-1 min-w-0 overflow-y-auto transition-[margin-left] duration-300 ease-in-out"
        style={{ marginLeft: mainContentMargin }}
      >
        <div className="p-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/study" element={<Study />} />
              <Route path="/create-quiz" element={<CreateQuiz />} />
              <Route path="/timed-quizzes" element={<TimedQuizzes />} />
              <Route path="/view-quizzes" element={<ViewQuizzes />} />
              <Route path="/quiz/:id" element={<ViewQuiz />} />
              <Route path="/quiz/:id/edit" element={<EditQuiz />} />
              {/* Route for My Attempts */}
              <Route path="/my-attempts" element={<MyAttempts />} />
            </Route>

            {/* Optional: Add a catch-all or Not Found route */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
