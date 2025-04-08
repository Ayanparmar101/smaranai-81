import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Toaster } from 'sonner';

// Pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import AuthPage from './pages/AuthPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import HistoryPage from './pages/HistoryPage';
import VoiceAssistantPage from './pages/VoiceAssistantPage';
import TeacherPage from './pages/TeacherPage';
import SocraticTutorPage from './pages/SocraticTutorPage';
import GrammarPage from './pages/GrammarPage';
import StoryImagesPage from './pages/StoryImagesPage';
import VoiceBotPage from './pages/VoiceBotPage';
import StudyPlannerPage from './pages/StudyPlannerPage';
import SpokenEnglishPage from './pages/SpokenEnglishPage';
import PomodoroPage from './pages/PomodoroPage';
import SubjectsPage from './pages/SubjectsPage';
import MathematicsPage from './pages/MathematicsPage';
import ProfilePage from './pages/ProfilePage';
import HindiPage from './pages/HindiPage';
import HindiChatbotPage from './pages/HindiChatbotPage';

// Math Pages
import ArithmeticPage from './pages/math/ArithmeticPage';
import AlgebraPage from './pages/math/AlgebraPage';
import GeometryPage from './pages/math/GeometryPage';
import CalculusPage from './pages/math/CalculusPage';
import StatisticsPage from './pages/math/StatisticsPage';

// Components
import { Layout } from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './components/ThemeProvider';
import { ScrollToTop } from './components/ScrollToTop';
import AuthGuard from './components/AuthGuard';

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <ScrollToTop />
          <Toaster richColors position="top-center" />
          <Routes>
            {/* Auth routes outside of AuthGuard */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth-callback" element={<AuthCallbackPage />} />
            
            {/* Protected routes with AuthGuard and Layout */}
            <Route path="/" element={
              <AuthGuard>
                <Layout>
                  <Index />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/history" element={
              <AuthGuard>
                <Layout>
                  <HistoryPage />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/voice-assistant" element={
              <AuthGuard>
                <Layout>
                  <VoiceAssistantPage />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/teacher" element={
              <AuthGuard>
                <Layout>
                  <TeacherPage />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/socratic-tutor" element={
              <AuthGuard>
                <Layout>
                  <SocraticTutorPage />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/grammar" element={
              <AuthGuard>
                <Layout>
                  <GrammarPage />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/story-images" element={
              <AuthGuard>
                <Layout>
                  <StoryImagesPage />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/voice-bot" element={
              <AuthGuard>
                <Layout>
                  <VoiceBotPage />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/study-planner" element={
              <AuthGuard>
                <Layout>
                  <StudyPlannerPage />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/spoken-english" element={
              <AuthGuard>
                <Layout>
                  <SpokenEnglishPage />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/pomodoro" element={
              <AuthGuard>
                <Layout>
                  <PomodoroPage />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/subjects" element={
              <AuthGuard>
                <Layout>
                  <SubjectsPage />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/mathematics" element={
              <AuthGuard>
                <Layout>
                  <MathematicsPage />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/profile" element={
              <AuthGuard>
                <Layout>
                  <ProfilePage />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/hindi" element={
              <AuthGuard>
                <Layout>
                  <HindiPage />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/hindi/chatbot" element={
              <AuthGuard>
                <Layout>
                  <HindiChatbotPage />
                </Layout>
              </AuthGuard>
            } />
            
            {/* Math Routes */}
            <Route path="/math/arithmetic" element={
              <AuthGuard>
                <Layout>
                  <ArithmeticPage />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/math/algebra" element={
              <AuthGuard>
                <Layout>
                  <AlgebraPage />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/math/geometry" element={
              <AuthGuard>
                <Layout>
                  <GeometryPage />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/math/calculus" element={
              <AuthGuard>
                <Layout>
                  <CalculusPage />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/math/statistics" element={
              <AuthGuard>
                <Layout>
                  <StatisticsPage />
                </Layout>
              </AuthGuard>
            } />
            
            <Route path="*" element={
              <AuthGuard>
                <Layout>
                  <NotFound />
                </Layout>
              </AuthGuard>
            } />
          </Routes>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
