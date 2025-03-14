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
import NotFound from "./pages/NotFound";
import FlashcardsPage from "./pages/FlashcardsPage"; // Added import for FlashcardsPage

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/grammar" element={<GrammarPage />} />
          <Route path="/story-images" element={<StoryImagesPage />} />
          <Route path="/spoken-english" element={<SpokenEnglishPage />} />
          <Route path="/voice-bot" element={<VoiceBotPage />} />
          <Route path="/socratic-tutor" element={<SocraticTutorPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} /> {/* Added route for flashcards */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;