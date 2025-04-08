
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
    <ThemeProvider defaultTheme="system" storageKey="smaran-theme">
      <ErrorBoundary>
        <Router>
          <ScrollToTop />
          <Toaster richColors position="top-center" />
          <AuthGuard>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/voice-assistant" element={<VoiceAssistantPage />} />
                <Route path="/teacher" element={<TeacherPage />} />
                <Route path="/socratic-tutor" element={<SocraticTutorPage />} />
                <Route path="/grammar" element={<GrammarPage />} />
                <Route path="/story-images" element={<StoryImagesPage />} />
                <Route path="/voice-bot" element={<VoiceBotPage />} />
                <Route path="/study-planner" element={<StudyPlannerPage />} />
                <Route path="/spoken-english" element={<SpokenEnglishPage />} />
                <Route path="/pomodoro" element={<PomodoroPage />} />
                <Route path="/subjects" element={<SubjectsPage />} />
                <Route path="/mathematics" element={<MathematicsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                
                {/* Math Routes */}
                <Route path="/math/arithmetic" element={<ArithmeticPage />} />
                <Route path="/math/algebra" element={<AlgebraPage />} />
                <Route path="/math/geometry" element={<GeometryPage />} />
                <Route path="/math/calculus" element={<CalculusPage />} />
                <Route path="/math/statistics" element={<StatisticsPage />} />
                
                <Route path="*" element={<NotFound />} />
              </Route>
              
              {/* Auth routes outside of Layout */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth-callback" element={<AuthCallbackPage />} />
            </Routes>
          </AuthGuard>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
