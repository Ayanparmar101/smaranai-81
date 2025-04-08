
import React from 'react';
import PomodoroTimer from './pomodoro/PomodoroTimer';
import { Layout } from '@/components/Layout';

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
