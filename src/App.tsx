import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Chatbot } from './components/Chatbot';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder for LandingPage if it doesn't exist yet or if we need to wrap existing content
// Assuming current App content IS the landing page, we might need to refactor.
// For now, let's create the route structure.

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white">
                <Navbar />
                <Chatbot />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <UserDashboard />
                        </ProtectedRoute>
                    } />
                    {/* Admin should also be protected in a real app, perhaps with a role check.
              For now keeping it accessible if auth state allows (AdminPage handles its own auth check UI) */}
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
