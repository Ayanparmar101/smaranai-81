
import React from 'react';
import { Layout } from '@/components/Layout';
import PomodoroTimer from './pomodoro/PomodoroTimer';

const PomodoroPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <PomodoroTimer />
      </div>
    </Layout>
  );
};

export default PomodoroPage;
