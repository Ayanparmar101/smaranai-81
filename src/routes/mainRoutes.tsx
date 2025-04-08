
import { RouteObject } from 'react-router-dom';

// Pages
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import HistoryPage from '@/pages/HistoryPage';
import VoiceAssistantPage from '@/pages/VoiceAssistantPage';
import TeacherPage from '@/pages/TeacherPage';
import SocraticTutorPage from '@/pages/SocraticTutorPage';
import GrammarPage from '@/pages/GrammarPage';
import StoryImagesPage from '@/pages/StoryImagesPage';
import VoiceBotPage from '@/pages/VoiceBotPage';
import StudyPlannerPage from '@/pages/StudyPlannerPage';
import SpokenEnglishPage from '@/pages/SpokenEnglishPage';
import PomodoroPage from '@/pages/PomodoroPage';
import SubjectsPage from '@/pages/SubjectsPage';
import MathematicsPage from '@/pages/MathematicsPage';
import ProfilePage from '@/pages/ProfilePage';
import HindiPage from '@/pages/HindiPage';
import HindiChatbotPage from '@/pages/HindiChatbotPage';

export const mainRoutes: RouteObject[] = [
  { path: '/', element: <Index /> },
  { path: '/history', element: <HistoryPage /> },
  { path: '/voice-assistant', element: <VoiceAssistantPage /> },
  { path: '/teacher', element: <TeacherPage /> },
  { path: '/socratic-tutor', element: <SocraticTutorPage /> },
  { path: '/grammar', element: <GrammarPage /> },
  { path: '/story-images', element: <StoryImagesPage /> },
  { path: '/voice-bot', element: <VoiceBotPage /> },
  { path: '/study-planner', element: <StudyPlannerPage /> },
  { path: '/spoken-english', element: <SpokenEnglishPage /> },
  { path: '/pomodoro', element: <PomodoroPage /> },
  { path: '/subjects', element: <SubjectsPage /> },
  { path: '/mathematics', element: <MathematicsPage /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/hindi', element: <HindiPage /> },
  { path: '/hindi/chatbot', element: <HindiChatbotPage /> },
  { path: '*', element: <NotFound /> }
];
