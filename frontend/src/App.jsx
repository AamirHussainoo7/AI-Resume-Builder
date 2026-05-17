/**
 * App.jsx — Root application component.
 * Sets up providers, routing, and toast notifications.
 */

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './redux/store';
import { ThemeProvider } from './context/ThemeContext';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <AppRouter />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                borderRadius: '10px',
                padding: '12px 16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              },
              success: {
                iconTheme: { primary: '#10b981', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}
