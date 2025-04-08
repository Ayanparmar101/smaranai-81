
import { BrowserRouter as Router, Routes, Route, useRoutes } from 'react-router-dom';
import './App.css';
import { Toaster } from 'sonner';

// Components
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './components/ThemeProvider';
import { ScrollToTop } from './components/ScrollToTop';

// Routes
import { appRoutes } from './routes';

// AppRoutes component to use the useRoutes hook
const AppRoutes = () => {
  const routes = useRoutes(appRoutes);
  return routes;
};

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <ScrollToTop />
          <Toaster richColors position="top-center" />
          <AppRoutes />
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
