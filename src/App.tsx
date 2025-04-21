import React, { useEffect } from 'react';
import PageLayout from './components/layout';
import { ConfigProvider } from 'antd';
import useConfigStore from './store/config';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';

const App: React.FC = () => {
  const theme = useConfigStore(state => state.themeConfig)
  const navigate = useNavigate()

  const location = useLocation();
  const accessToken = useAuthStore(state => state.accessToken);
  const isLoginPage = location.pathname === '/login';
  const user = useAuthStore(state => state.user);
  
  useEffect(() => {
    const isAdmin = user?.userRole === 'ADMIN';
    const isAuthed = !!accessToken;

    // Not logged in → redirect to login
    if (!isAuthed && !isLoginPage) {
      navigate('/login');
    }

    // Logged in but not admin → redirect to forbidden or logout
    if (isAuthed && !isAdmin && !isLoginPage) {
      alert('You are not authorized to access the admin panel.');
      navigate('/login');
    }
  }, [accessToken, isLoginPage, navigate, user]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.algorithm,
        token: {
          colorPrimary: theme.primaryColor,
        },
      }}
    >
      {isLoginPage ? (
        // No layout on login page
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Render just the page content (Login component will be placed via router) */}
          <Outlet />
        </div>
      ) : (
        // Full layout for all other pages
        <PageLayout />
      )}
    </ConfigProvider>
  );
};

export default App;
