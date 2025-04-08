
import React from 'react';

interface TopicSelectorProps {
  topics: string[];
  selectedTopic: string;
  onTopicSelect: (topic: string) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ 
  topics, 
  selectedTopic, 
  onTopicSelect 
}) => {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold mb-4">Choose a topic to study:</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => onTopicSelect(topic)}
            className={`p-4 border-3 border-black rounded-xl transition-all ${
              selectedTopic === topic
                ? 'bg-kid-green text-white shadow-none translate-y-1'
                : 'bg-white shadow-neo-sm hover:shadow-none hover:translate-y-1'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicSelector;
