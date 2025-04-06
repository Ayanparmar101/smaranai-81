
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Link } from "react-router-dom";

const SubjectsPage: React.FC = () => {
  const subjects = [
    {
      title: "Gujarati Language",
      description: "Learn Gujarati through interactive lessons, poems, and a dedicated chatbot.",
      icon: "🇮🇳",
      route: "/gujarati",
      color: "bg-orange-100 dark:bg-orange-950",
    },
    {
      title: "Mathematics",
      description: "Master math concepts with guided problem-solving and step-by-step explanations.",
      icon: "🧮",
      route: "/mathematics",
      color: "bg-blue-100 dark:bg-blue-950",
    },
    {
      title: "Grammar",
      description: "Improve your grammar with personalized lessons and practical exercises.",
      icon: "📝",
      route: "/grammar",
      color: "bg-green-100 dark:bg-green-950",
    },
    {
      title: "Study Tools",
      description: "Access helpful study tools like planners, timers, and AI assistance.",
      icon: "📚",
      route: "/study-planner",
      color: "bg-purple-100 dark:bg-purple-950",
    },
    {
      title: "Creative Learning",
      description: "Explore creative learning methods with story illustrations and voice interactions.",
      icon: "🎨",
      route: "/story-images",
      color: "bg-pink-100 dark:bg-pink-950",
    },
    {
      title: "AI Assistance",
      description: "Get personalized help from our AI teacher and Socratic tutor.",
      icon: "🤖",
      route: "/teacher",
      color: "bg-yellow-100 dark:bg-yellow-950",
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore Subjects</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover our wide range of subjects and learning tools designed to help you master new skills and knowledge.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject, index) => (
          <Link to={subject.route} key={index}>
            <Card className={`h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${subject.color}`}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-3xl mr-2">{subject.icon}</span>
                  {subject.title}
                </CardTitle>
                <CardDescription>{subject.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-right">
                  <span className="underline">Explore →</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SubjectsPage;
