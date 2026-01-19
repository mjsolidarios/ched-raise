import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Chatbot } from './components/Chatbot';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import { Suspense, lazy } from 'react';
// import AdminPage from './pages/AdminPage'; // Direct import to fix potential lazy loading issue
// import NotFoundPage from './pages/NotFoundPage';

// Lazy load all pages for code splitting optimization
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const VenuePage = lazy(() => import('./pages/VenuePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const SurveyPage = lazy(() => import('./pages/SurveyPage'));
const AgendaPage = lazy(() => import('./pages/AgendaPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const MediaAssetsPage = lazy(() => import('./pages/MediaAssetsPage'));
const AttendancePage = lazy(() => import('./pages/AttendancePage'));
const ProgramPage = lazy(() => import('./pages/ProgramPage'));
const ResourcePersonsPage = lazy(() => import('./pages/ResourcePersonsPage'));

// Loading component
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const ConditionalChatbot = () => {
    const location = useLocation();
    if (location.pathname.startsWith('/admin')) {
        return null;
    }
    return <Chatbot />;
};

const App = () => {
    return (
        <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white">
                <Navbar />
                <ConditionalChatbot />
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <UserDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/venue" element={<VenuePage />} />
                        <Route path="/survey" element={
                            <ProtectedRoute>
                                <SurveyPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                        <Route path="/agenda" element={<AgendaPage />} />
                        <Route path="/program" element={<ProgramPage />} />
                        <Route path="/resource-persons" element={<ResourcePersonsPage />} />
                        <Route path="/media" element={<MediaAssetsPage />} />
                        <Route path="/attendance" element={
                            <ProtectedRoute allowedRoles={['regional_admin', 'super_admin']}>
                                <AttendancePage />
                            </ProtectedRoute>
                        } />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Suspense>
            </div>
        </Router>
    );
};

export default App;
