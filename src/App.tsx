import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Chatbot } from './components/Chatbot';
import ProtectedRoute from './components/ProtectedRoute';
import { Suspense, lazy } from 'react';

// Lazy load pages for code splitting optimization
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

// Loading component
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white">
                <Navbar />
                <Chatbot />
                <Suspense fallback={<PageLoader />}>
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
                </Suspense>
            </div>
        </Router>
    );
};

export default App;
