
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Dashboard from './pages/Dashboard';
import Feedback from './pages/Feedback';

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
        return (
          <div className="page-placeholder">
            <h1>Course Analytics</h1>
            <p>Course performance analytics coming soon.</p>
          </div>
        );

      case 'Sentiment Analysis':
        return (
          <div className="page-placeholder">
            <h1>Sentiment Analysis</h1>
            <p>AI sentiment analysis coming soon.</p>
          </div>
        );

      case 'Topic Insights':
        return (
          <div className="page-placeholder">
            <h1>Topic Insights</h1>
            <p>Topic analysis coming soon.</p>
          </div>
        );

      case 'Recommendations':
        return (
          <div className="page-placeholder">
            <h1>Recommendations</h1>
            <p>AI recommendations coming soon.</p>
          </div>
        );

      case 'Reports':
        return (
          <div className="page-placeholder">
            <h1>Reports</h1>
            <p>Reports and downloads coming soon.</p>
          </div>
        );

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
