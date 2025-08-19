import React, { useState, useEffect } from 'react';
import './UploadPage.css';

const UploadPage = ({ loanRequest, onSuccess, onError, onStartAnalysis, error, onReset }) => {
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [annualIncome, setAnnualIncome] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!aadhaarFile || !panFile || !annualIncome) {
      onError('All fields are required for analysis.');
      return;
    }
    
    onStartAnalysis(); // Switch to the analysis animation page

    // Simulate a delay for the animation to be visible
    setTimeout(async () => {
      const formData = new FormData();
      formData.append('aadhaar_file', aadhaarFile);
      formData.append('pan_file', panFile);
      formData.append('annual_income', annualIncome);
      formData.append('desired_amount', loanRequest.amount);
      formData.append('desired_tenure', loanRequest.tenure);

      try {
        const response = await fetch('http://127.0.0.1:8000/extract', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.detail || 'An unknown error occurred during processing.');
        }
        onSuccess(data);
      } catch (error) {
        onError(error.message);
      }
    }, 4000); // 4-second delay to show the full animation
  };

  if (error) {
    return (
      <div className="upload-container">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h2>Upload Error</h2>
          <p className="error-message">{error}</p>
          <button onClick={onReset} className="reset-button">
            <span>Start Over</span>
            <span className="button-icon">🔄</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-container">
      {/* Floating Particles */}
      <div className="particles">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`particle particle-${i + 1}`}
          />
        ))}
      </div>

      <div className={`upload-content ${isVisible ? 'visible' : ''}`}>
        <div className="upload-header">
          <h1>Secure Document Upload</h1>
          <p>Please provide your KYC documents and financial details for AI-powered verification</p>
        </div>

        <div className="upload-card">
          <div className="card-shine" />
          
          <div className="loan-summary">
            <div className="summary-icon">📋</div>
            <h3>Loan Request Summary</h3>
            <div className="summary-details">
              <div className="summary-item">
                <span className="label">Amount:</span>
                <span className="value">₹ {Number(loanRequest.amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-item">
                <span className="label">Tenure:</span>
                <span className="value">{loanRequest.tenure} months</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-section">
              <h3>Document Verification</h3>
              <p>Upload clear images of your identity documents</p>
              
              <div className="file-upload-group">
                <div className="file-upload-item">
                  <label htmlFor="aadhaar" className="file-label">
                    <div className="file-icon">🆔</div>
                    <span>Aadhaar Card</span>
                    <span className="file-hint">Click to upload image</span>
                  </label>
                  <input 
                    type="file" 
                    id="aadhaar" 
                    className="file-input" 
                    accept="image/*" 
                    onChange={(e) => setAadhaarFile(e.target.files[0])} 
                    required 
                  />
                  {aadhaarFile && (
                    <div className="file-preview">
                      <span className="file-name">✓ {aadhaarFile.name}</span>
                    </div>
                  )}
                </div>

                <div className="file-upload-item">
                  <label htmlFor="pan" className="file-label">
                    <div className="file-icon">📄</div>
                    <span>PAN Card</span>
                    <span className="file-hint">Click to upload image</span>
                  </label>
                  <input 
                    type="file" 
                    id="pan" 
                    className="file-input" 
                    accept="image/*" 
                    onChange={(e) => setPanFile(e.target.files[0])} 
                    required 
                  />
                  {panFile && (
                    <div className="file-preview">
                      <span className="file-name">✓ {panFile.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Financial Information</h3>
              <p>Provide your annual income for eligibility assessment</p>
              
              <div className="income-input-group">
                <label htmlFor="income" className="income-label">
                  Annual Income (in Lakhs)
                </label>
                <div className="income-input-container">
                  <input 
                    type="number" 
                    id="income" 
                    className="income-input" 
                    placeholder="e.g., 12.5" 
                    value={annualIncome} 
                    onChange={(e) => setAnnualIncome(e.target.value)} 
                    required 
                  />
                  <span className="input-suffix">Lakhs</span>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                <span className="button-text">Begin AI Analysis</span>
                <span className="button-icon">🤖</span>
              </button>
            </div>
          </form>
        </div>

        <div className="security-features">
          <div className="security-item">
            <div className="security-icon">🔒</div>
            <span>End-to-End Encryption</span>
          </div>
          <div className="security-item">
            <div className="security-icon">🛡️</div>
            <span>Bank-Grade Security</span>
          </div>
          <div className="security-item">
            <div className="security-icon">⚡</div>
            <span>Instant Processing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
