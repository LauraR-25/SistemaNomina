import './styles/index.css';
import { createRoot } from 'react-dom/client';
import AppShell from './AppShell.jsx';
import app from './app.model.js';
import { AuthProvider } from './context/AuthContext.jsx';
import { LayoutProvider } from './context/LayoutContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <AuthProvider>
      <NotificationProvider>
        <LayoutProvider>
          <AppShell />
        </LayoutProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default app;
