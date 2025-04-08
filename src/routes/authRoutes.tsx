
import { RouteObject } from 'react-router-dom';
import AuthPage from '@/pages/AuthPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';

export const authRoutes: RouteObject[] = [
  { path: '/auth', element: <AuthPage /> },
  { path: '/auth-callback', element: <AuthCallbackPage /> }
];
