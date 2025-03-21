
import React from 'react';
import { Layout } from '@/components/Layout';
import PomodoroTimer from './pomodoro/PomodoroTimer';

const PomodoroPage = () => {
  return (
    <Layout>
      <PomodoroTimer />
    </Layout>
  );
};

export default PomodoroPage;
