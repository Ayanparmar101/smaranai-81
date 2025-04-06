
import React from 'react';

interface AgeGroup {
  age: string;
  title: string;
  description: string;
  benefits: string[];
}

interface AgeGroupsSectionProps {
  ageGroups?: AgeGroup[];
}

const AgeGroupsSection: React.FC<AgeGroupsSectionProps> = ({ ageGroups }) => {
  const defaultAgeGroups = [
    {
      grade: '1-2',
      title: 'Early Learners',
      color: 'bg-kid-green'
    }, 
    {
      grade: '3-4',
      title: 'Building Skills',
      color: 'bg-kid-blue'
    }, 
    {
      grade: '5-6',
      title: 'Growing Confident',
      color: 'bg-kid-purple'
    }, 
    {
      grade: '7-8',
      title: 'Advanced English',
      color: 'bg-kid-red'
    }
  ];

  return (
    <section className="px-0 py-[40px]">
      <div className="container mx-auto px-4">
        <h2 className="section-title">For All Age Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          {defaultAgeGroups.map((group, index) => (
            <div key={index} className="card-doodle transition-all duration-300 hover:scale-105">
              <div className={`${group.color} text-white text-sm font-medium px-3 py-1 rounded-full w-fit mb-4`}>
                Grades {group.grade}
              </div>
              <h3 className="text-xl font-bold mb-3">{group.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Lessons and activities specifically designed for this age group's learning needs.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgeGroupsSection;
