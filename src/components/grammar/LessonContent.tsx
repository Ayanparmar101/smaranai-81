
import React from 'react';

interface LessonContentProps {
  title: string;
  level: string;
  content: string;
  examples: string[];
}

const LessonContent: React.FC<LessonContentProps> = ({ title, level, content, examples }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border-2 border-black ${
          level === 'Easy' ? 'bg-green-100 text-green-800' :
          level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {level}
        </span>
      </div>

      <div className="prose max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Examples:</h3>
        <ul className="space-y-2">
          {examples.map((example, index) => (
            <li key={index} className="flex items-start">
              <span className="bg-kid-yellow text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 border-2 border-black">
                {index + 1}
              </span>
              <span>{example}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default LessonContent;
