
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Dashboard from './pages/Dashboard';
import Feedback from './pages/Feedback';
import CourseAnalytics from './pages/CourseAnalytics';
import Sentiment from './pages/Sentiment';
import TopicInsights from './pages/TopicInsights';
import Recommendations from './pages/Recommendations';
import Reports from './pages/Reports';

import './App.css';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function App() {
  const [activePage, setActivePage] = useState('Dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard />;

      case 'Feedback':
        return <Feedback />;

      case 'Course Analytics':
        return <CourseAnalytics />;

      case 'Sentiment Analysis':
        return <Sentiment />;

      case 'Topic Insights':
        return <TopicInsights />;

      case 'Recommendations':
        return <Recommendations />;

      case 'Reports':
        return <Reports />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="main-content">
        <Navbar activePage={activePage} />

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
