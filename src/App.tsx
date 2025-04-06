
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GujaratiPage from "./pages/GujaratiPage";
import MathematicsPage from "./pages/MathematicsPage";
import GrammarPage from "./pages/GrammarPage";
import StudyPlannerPage from "./pages/StudyPlannerPage";
import PomodoroPage from "./pages/PomodoroPage";
import StoryImagesPage from "./pages/StoryImagesPage";
import TeacherPage from "./pages/TeacherPage";
import VoiceBotPage from "./pages/VoiceBotPage";
import SocraticTutorPage from "./pages/SocraticTutorPage";
import HistoryPage from "./pages/HistoryPage";
import SubjectsPage from "./pages/SubjectsPage";
import ProfilePage from "./pages/ProfilePage";
import GujaratiLessonsPage from "./pages/gujarati/GujaratiLessonsPage";
import GujaratiPoemsPage from "./pages/gujarati/GujaratiPoemsPage";
import GujaratiChatbotPage from "./pages/gujarati/GujaratiChatbotPage";
import AlgebraPage from "./pages/math/AlgebraPage";
import GeometryPage from "./pages/math/GeometryPage";
import ArithmeticPage from "./pages/math/ArithmeticPage";
import CalculusPage from "./pages/math/CalculusPage";
import StatisticsPage from "./pages/math/StatisticsPage";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./components/ThemeProvider";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="subjects" element={<SubjectsPage />} />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="history" element={<HistoryPage />} />
            <Route path="gujarati" element={<GujaratiPage />} />
            <Route path="gujarati/lessons" element={<GujaratiLessonsPage />} />
            <Route path="gujarati/poems" element={<GujaratiPoemsPage />} />
            <Route path="gujarati/chatbot" element={<GujaratiChatbotPage />} />
            <Route path="mathematics" element={<MathematicsPage />} />
            <Route path="mathematics/algebra" element={<AlgebraPage />} />
            <Route path="mathematics/geometry" element={<GeometryPage />} />
            <Route path="mathematics/arithmetic" element={<ArithmeticPage />} />
            <Route path="mathematics/calculus" element={<CalculusPage />} />
            <Route path="mathematics/statistics" element={<StatisticsPage />} />
            <Route path="grammar" element={<GrammarPage />} />
            <Route path="study-planner" element={<StudyPlannerPage />} />
            <Route path="pomodoro" element={<PomodoroPage />} />
            <Route path="story-images" element={<StoryImagesPage />} />
            <Route path="teacher" element={<TeacherPage />} />
            <Route path="voice-bot" element={<VoiceBotPage />} />
            <Route path="socratic-tutor" element={<SocraticTutorPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Routes>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
