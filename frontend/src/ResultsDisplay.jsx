import React, { useState, useEffect } from 'react';
import './ResultsDisplay.css';

const ResultsDisplay = ({ data, onReset }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (data.status === 'Rejected') {
    return (
      <div className="results-container">
        {/* Floating Particles */}
        <div className="particles">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`particle particle-${i + 1}`}
            />
          ))}
        </div>

        <div className={`results-content ${isVisible ? 'visible' : ''}`}>
          <div className="results-header">
            <h1>Application Status</h1>
            <p>Your loan application has been processed by our AI system</p>
          </div>

          <div className="result-card rejected">
            <div className="card-shine" />
            
            <div className="status-section">
              <div className="status-icon">❌</div>
              <h2>Application Status: {data.status}</h2>
              <p className="reason-text">{data.reason}</p>
            </div>

            <div className="action-section">
              <button onClick={onReset} className="reset-button">
                <span>Submit a New Application</span>
                <span className="button-icon">🔄</span>
              </button>
            </div>
          </div>

          <div className="support-info">
            <div className="support-item">
              <div className="support-icon">📞</div>
              <span>Contact Support</span>
            </div>
            <div className="support-item">
              <div className="support-icon">📧</div>
              <span>Email Assistance</span>
            </div>
            <div className="support-item">
              <div className="support-icon">💬</div>
              <span>Live Chat</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      {/* Floating Particles */}
      <div className="particles">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`particle particle-${i + 1}`}
          />
        ))}
      </div>

      <div className={`results-content ${isVisible ? 'visible' : ''}`}>
        <div className="results-header">
          <h1>Congratulations! 🎉</h1>
          <p>Your provisional loan offer has been generated successfully</p>
        </div>

        <div className="result-card approved">
          <div className="card-shine" />
          
          <div className="status-section">
            <div className="status-icon">✅</div>
            <h2>Provisional Loan Offer Generated</h2>
            <p>Based on our AI analysis, you are eligible for the following offer</p>
          </div>

          <div className="result-grid">
            <div className="result-item">
              <div className="result-icon">💰</div>
              <div className="result-content">
                <span className="label">Eligible Loan Amount</span>
                <span className="value">₹ {Number(data.eligible_amount).toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <div className="result-item">
              <div className="result-icon">📊</div>
              <div className="result-content">
                <span className="label">Offered Interest Rate</span>
                <span className="value">{data.offered_rate}% p.a.</span>
              </div>
            </div>
            
            <div className="result-item">
              <div className="result-icon">📅</div>
              <div className="result-content">
                <span className="label">Final Loan Tenure</span>
                <span className="value">{data.offered_tenure} months</span>
              </div>
            </div>
            
            <div className="result-item emi-highlight">
              <div className="result-icon">💳</div>
              <div className="result-content">
                <span className="label">Estimated Monthly EMI</span>
                <span className="value">₹ {Number(data.calculated_emi).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="action-section">
            <button onClick={onReset} className="reset-button">
              <span>Start a New Application</span>
              <span className="button-icon">🔄</span>
            </button>
          </div>
        </div>

        <div className="next-steps">
          <h3>Next Steps</h3>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-icon">📋</div>
              <span>Complete Documentation</span>
            </div>
            <div className="step-item">
              <div className="step-icon">🔍</div>
              <span>Final Verification</span>
            </div>
            <div className="step-item">
              <div className="step-icon">✅</div>
              <span>Loan Disbursement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
