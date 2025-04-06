
import React from "react";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import AgeGroupsSection from "../components/home/AgeGroupsSection";
import CallToActionSection from "../components/home/CallToActionSection";
import Footer from "../components/Footer";

const Index: React.FC = () => {
  const features = [
    {
      title: "Gujarati Language Learning",
      description:
        "Learn Gujarati with our interactive lessons, poems, and chatbot assistance.",
      icon: "🇮🇳",
      route: "/gujarati",
    },
    {
      title: "Mathematics Made Easy",
      description:
        "Master mathematics concepts with interactive problem-solving and step-by-step guidance.",
      icon: "🧮",
      route: "/mathematics",
    },
    {
      title: "Grammar Assistance",
      description:
        "Improve your grammar skills with personalized lessons and exercises.",
      icon: "📝",
      route: "/grammar",
    },
    {
      title: "Study Planner",
      description:
        "Create personalized study plans based on your goals and schedule.",
      icon: "📆",
      route: "/study-planner",
    },
    {
      title: "Pomodoro Timer",
      description:
        "Stay focused and manage your study time effectively with our Pomodoro timer.",
      icon: "⏱️",
      route: "/pomodoro",
    },
    {
      title: "Story Illustrations",
      description:
        "Transform your stories into beautiful illustrations with AI-generated images.",
      icon: "🖼️",
      route: "/story-images",
    },
    {
      title: "AI Teacher Assistant",
      description:
        "Get personalized help with homework and study materials from our AI teacher.",
      icon: "👨‍🏫",
      route: "/teacher",
    },
    {
      title: "Voice Bot",
      description:
        "Practice speaking and conversation with our interactive voice bot.",
      icon: "🎤",
      route: "/voice-bot",
    },
    {
      title: "Socratic Tutor",
      description:
        "Learn through guided questioning with our Socratic method tutor.",
      icon: "🧠",
      route: "/socratic-tutor",
    },
  ];

  const ageGroups = [
    {
      age: "6-10",
      title: "Elementary Students",
      description:
        "Fun, interactive learning experiences tailored for young minds.",
      benefits: [
        "Engaging stories and visual aids",
        "Basic language and math skills",
        "Interactive games that make learning fun",
      ],
    },
    {
      age: "11-14",
      title: "Middle School Students",
      description:
        "Comprehensive tools to build strong academic foundations.",
      benefits: [
        "Detailed explanations of complex concepts",
        "Study guides and practice exercises",
        "Time management and organization skills",
      ],
    },
    {
      age: "15-18",
      title: "High School Students",
      description:
        "Advanced resources to excel in higher-level academics.",
      benefits: [
        "Exam preparation and practice tests",
        "In-depth subject matter expertise",
        "Research and essay writing assistance",
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection features={features} />
        <AgeGroupsSection ageGroups={ageGroups} />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
