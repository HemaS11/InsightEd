import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Feedback from './pages/Feedback';
import CourseAnalytics from './pages/CourseAnalytics';
import Sentiment from './pages/Sentiment';
import TopicInsights from './pages/TopicInsights';
import Recommendations from './pages/Recommendations';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';

import './App.css';
import './pages/Login.css';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageAccess: Record<string, string[]> = {
  Dashboard: ['admin', 'faculty', 'student'],
  Feedback: ['student'],
  'Course Analytics': ['admin', 'faculty'],
  'Sentiment Analysis': ['admin', 'faculty'],
  'Topic Insights': ['admin', 'faculty'],
  Recommendations: ['admin', 'faculty'],
  Reports: ['admin', 'faculty'],
  'User Management': ['admin'],
};

function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!pageAccess[activePage]?.includes(user.role)) {
      setActivePage('Dashboard');
    }
  }, [activePage, user]);

  const handleLogin = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    setActivePage('Dashboard');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setActivePage('Dashboard');
  };

  if (!token || !user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard token={token} userName={user.name} />;

      case 'Feedback':
        return <Feedback token={token} />;

      case 'Course Analytics':
        return <CourseAnalytics token={token} />;

      case 'Sentiment Analysis':
        return <Sentiment token={token} />;

      case 'Topic Insights':
        return <TopicInsights token={token} />;

      case 'Recommendations':
        return <Recommendations token={token} />;

      case 'Reports':
        return <Reports token={token} />;

      case 'User Management':
        return <UserManagement token={token} />;

      default:
        return <Dashboard token={token} userName={user.name} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <Navbar activePage={activePage} user={user} />

        <div className="page-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              className="page-shell"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
