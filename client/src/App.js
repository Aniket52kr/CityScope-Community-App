import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/index.css';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#e6ecf0]">
        <Navbar />
        <main className="p-4">
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
