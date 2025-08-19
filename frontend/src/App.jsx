import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import DummyHomePage from './DummyHomePage';
import DummyBankingPage from './DummyBankingPage';
import LoansPage from './LoansPage';
import DummyProfilePage from './DummyProfilePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<DummyHomePage />} />
          <Route path="/banking" element={<DummyBankingPage />} />
          <Route path="/loans" element={<LoansPage />} />
          <Route path="/profile" element={<DummyProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
