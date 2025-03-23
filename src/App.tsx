
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import PomodoroPage from './pages/PomodoroPage';
import SpokenEnglishPage from './pages/SpokenEnglishPage';
import StoryImagesPage from './pages/StoryImagesPage';
import StudyPlannerPage from './pages/StudyPlannerPage';
import SocraticTutorPage from './pages/SocraticTutorPage';
import ProfilePage from './pages/ProfilePage';
import GrammarPage from './pages/GrammarPage';
import AuthPage from './pages/AuthPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import HistoryPage from './pages/HistoryPage';
import ProtectedRoute from './components/ProtectedRoute';
import VoiceBotPage from './pages/VoiceBotPage';
import SubjectsPage from './pages/SubjectsPage';
import MathematicsPage from './pages/MathematicsPage';
import TeacherPage from './pages/TeacherPage';

// Math subject pages
import ArithmeticPage from './pages/math/ArithmeticPage';
import AlgebraPage from './pages/math/AlgebraPage';
import GeometryPage from './pages/math/GeometryPage';
import CalculusPage from './pages/math/CalculusPage';
import StatisticsPage from './pages/math/StatisticsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/mathematics" element={<MathematicsPage />} />
        
        {/* Math subject routes */}
        <Route path="/math/arithmetic" element={<ArithmeticPage />} />
        <Route path="/math/algebra" element={<AlgebraPage />} />
        <Route path="/math/geometry" element={<GeometryPage />} />
        <Route path="/math/calculus" element={<CalculusPage />} />
        <Route path="/math/statistics" element={<StatisticsPage />} />
        
        <Route path="/pomodoro" element={<PomodoroPage />} />
        <Route path="/grammar" element={<GrammarPage />} />
        <Route path="/spoken-english" element={<SpokenEnglishPage />} />
        <Route path="/story-images" element={<StoryImagesPage />} />
        <Route path="/study-planner" element={<StudyPlannerPage />} />
        <Route path="/socratic-tutor" element={<SocraticTutorPage />} />
        <Route path="/voice-bot" element={<VoiceBotPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
        
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
