
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GrammarPage from "./pages/GrammarPage";
import StoryImagesPage from "./pages/StoryImagesPage";
import SpokenEnglishPage from "./pages/SpokenEnglishPage";
import VoiceBotPage from "./pages/VoiceBotPage";
import SocraticTutorPage from "./pages/SocraticTutorPage";
import TeacherPage from "./pages/TeacherPage";
import StudyPlannerPage from "./pages/StudyPlannerPage";
import PomodoroPage from "./pages/PomodoroPage";
import AuthPage from "./pages/AuthPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import ProfilePage from "./pages/ProfilePage";
import HistoryPage from "./pages/HistoryPage";
import NotFound from "./pages/NotFound";
import { createContext, useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { ThemeProvider } from "./components/ThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";

export const AuthContext = createContext<{
  session: Session | null;
  user: any;
}>({
  session: null,
  user: null,
});

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthContext.Provider value={{ session, user: session?.user ?? null }}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                <Route 
                  path="/grammar" 
                  element={
                    <ProtectedRoute>
                      <GrammarPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/story-images" 
                  element={
                    <ProtectedRoute>
                      <StoryImagesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/spoken-english" 
                  element={
                    <ProtectedRoute>
                      <SpokenEnglishPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/voice-bot" 
                  element={
                    <ProtectedRoute>
                      <VoiceBotPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/socratic-tutor" 
                  element={
                    <ProtectedRoute>
                      <SocraticTutorPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/study-planner" 
                  element={
                    <ProtectedRoute>
                      <StudyPlannerPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/pomodoro" 
                  element={
                    <ProtectedRoute>
                      <PomodoroPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/teacher" 
                  element={
                    <ProtectedRoute>
                      <TeacherPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/history" 
                  element={
                    <ProtectedRoute>
                      <HistoryPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
