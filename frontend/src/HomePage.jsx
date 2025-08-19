import React, { useState, useEffect } from 'react';
import './HomePage.css';

const HomePage = ({ onSubmit }) => {
  const [amount, setAmount] = useState(500000);
  const [tenure, setTenure] = useState(24);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(amount, tenure);
  };

  return (
    <div className="homepage-container">
      {/* Floating Particles */}
      <div className="particles">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`particle particle-${i + 1}`}
          />
        ))}
      </div>

      <div className={`homepage-content ${isVisible ? 'visible' : ''}`}>
        <div className="hero-section">
          <h1 className="hero-title">
            AI-Powered Instant Loan Portal
          </h1>
          <p className="hero-description">
            Secure, transparent, and fast loan eligibility checks powered by cutting-edge AI technology.
          </p>
        </div>

        <div className="loan-form-card">
          <div className="card-shine" />
          
          <div className="form-header">
            <div className="form-icon">🏦</div>
            <h2>Loan Eligibility Calculator</h2>
            <p>Configure your loan requirements and get instant AI-powered eligibility assessment</p>
          </div>

          <form onSubmit={handleSubmit} className="loan-form">
            <div className="form-group">
              <label htmlFor="amount" className="form-label">
                I need a loan of: <strong className="amount-display">₹ {Number(amount).toLocaleString('en-IN')}</strong>
              </label>
              <div className="slider-container">
                <input 
                  type="range" 
                  id="amount" 
                  min="50000" 
                  max="2500000" 
                  step="10000" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  className="custom-slider" 
                />
                <div className="slider-track">
                  <div 
                    className="slider-fill" 
                    style={{ width: `${((amount - 50000) / (2500000 - 50000)) * 100}%` }}
                  />
                </div>
                <div className="slider-labels">
                  <span>₹ 50 Thousand</span>
                  <span>₹ 25 Lakhs</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="tenure" className="form-label">
                For a tenure of: <strong className="tenure-display">{tenure} months</strong> ({Math.floor(tenure/12)} years)
              </label>
              <div className="slider-container">
                <input 
                  type="range" 
                  id="tenure" 
                  min="12" 
                  max="60" 
                  step="6" 
                  value={tenure} 
                  onChange={(e) => setTenure(e.target.value)} 
                  className="custom-slider" 
                />
                <div className="slider-track">
                  <div 
                    className="slider-fill" 
                    style={{ width: `${((tenure - 12) / (60 - 12)) * 100}%` }}
                  />
                </div>
                <div className="slider-labels">
                  <span>12 months</span>
                  <span>60 months</span>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                <span className="button-text">Check Eligibility</span>
                <span className="button-icon">⚡</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
