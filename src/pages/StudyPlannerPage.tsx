
import React from 'react';
import { Layout } from '@/components/Layout';
import StudyPlannerContainer from './study-planner/StudyPlannerContainer';
import ErrorBoundary from '@/components/ErrorBoundary';

const StudyPlannerPage = () => {
  return (
    <Layout>
      <ErrorBoundary>
        <StudyPlannerContainer />
      </ErrorBoundary>
    </Layout>
  );
};

export default StudyPlannerPage;
