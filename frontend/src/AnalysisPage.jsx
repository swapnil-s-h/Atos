import React, { useState, useEffect } from 'react';
import './AnalysisPage.css';

const AnalysisPage = () => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initiating Secure Connection...');
  const [isVisible, setIsVisible] = useState(false);

  const analysisSteps = [
    { percent: 25, text: 'Parsing Document Images with AI-OCR...', icon: '🔍' },
    { percent: 50, text: 'Verifying KYC Data Integrity...', icon: '🛡️' },
    { percent: 75, text: 'Running Credit Eligibility Algorithm...', icon: '📊' },
    { percent: 100, text: 'Finalizing Provisional Loan Offer...', icon: '✅' },
  ];

  useEffect(() => {
    setIsVisible(true);
    
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < analysisSteps.length) {
        setProgress(analysisSteps[currentStep].percent);
        setStatusText(analysisSteps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 1000); // 1 second per step

    return () => clearInterval(interval);
  }, []);

  const circleConfig = {
    viewBox: '0 0 36 36',
    x: '18',
    y: '18',
    r: '15.91549430918954',
  };

  const strokeDasharray = `${progress}, 100`;

  return (
    <div className="analysis-container">
      {/* Floating Particles */}
      <div className="particles">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`particle particle-${i + 1}`}
          />
        ))}
      </div>

      <div className={`analysis-content ${isVisible ? 'visible' : ''}`}>
        <div className="analysis-header">
          <h1>AI-Powered Analysis in Progress</h1>
          <p>Our advanced algorithms are securely processing your documents and financial data</p>
        </div>

        <div className="analysis-card">
          <div className="card-shine" />
          
          <div className="progress-section">
            <div className="progress-circle">
              <svg viewBox={circleConfig.viewBox}>
                <circle
                  className="progress-background"
                  cx={circleConfig.x}
                  cy={circleConfig.y}
                  r={circleConfig.r}
                />
                <circle
                  className="progress-bar"
                  cx={circleConfig.x}
                  cy={circleConfig.y}
                  r={circleConfig.r}
                  strokeDasharray={strokeDasharray}
                />
              </svg>
              <div className="progress-text">{progress}%</div>
              <div className="progress-icon">
                {analysisSteps.find(step => step.percent === progress)?.icon || '🤖'}
              </div>
            </div>
            
            <div className="status-section">
              <h2 className="status-text">{statusText}</h2>
              <p className="sub-text">Your data is encrypted and processed securely with bank-grade protection</p>
            </div>
          </div>

          <div className="analysis-features">
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <span>End-to-End Encryption</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🤖</div>
              <span>AI-Powered Analysis</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <span>Real-time Processing</span>
            </div>
          </div>
        </div>

        <div className="processing-steps">
          {analysisSteps.map((step, index) => (
            <div 
              key={step.percent} 
              className={`step-item ${progress >= step.percent ? 'completed' : ''}`}
            >
              <div className="step-icon">
                {progress >= step.percent ? '✅' : step.icon}
              </div>
              <div className="step-content">
                <span className="step-text">{step.text}</span>
                <div className="step-progress">
                  <div 
                    className="step-progress-bar" 
                    style={{ width: progress >= step.percent ? '100%' : '0%' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;

