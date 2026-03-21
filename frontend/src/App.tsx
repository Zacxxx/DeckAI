import React, { useState } from 'react';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import CreationPage from './pages/CreationPage';
import StoragePage from './pages/StoragePage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onStart={() => setCurrentPage('user-area')} />;
      case 'user-area':
        return <CreationPage />;
      case 'storage':
        return <StoragePage />;
      default:
        return <LandingPage onStart={() => setCurrentPage('user-area')} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}
