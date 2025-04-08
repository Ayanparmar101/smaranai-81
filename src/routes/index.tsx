
import { RouteObject } from 'react-router-dom';
import { mainRoutes } from './mainRoutes';
import { mathRoutes } from './mathRoutes';
import { authRoutes } from './authRoutes';
import { createProtectedRoute } from './ProtectedRoute';

// Convert regular routes to protected routes
const protectedMainRoutes = mainRoutes.map(route => 
  createProtectedRoute({ path: route.path!, element: route.element! })
);

const protectedMathRoutes = mathRoutes.map(route => 
  createProtectedRoute({ path: route.path!, element: route.element! })
);

// Combine all routes
export const appRoutes: RouteObject[] = [
  ...authRoutes,
  ...protectedMainRoutes,
  ...protectedMathRoutes
];
