import React, { useState } from 'react';
import HomePage from './HomePage';
import UploadPage from './UploadPage';
import AnalysisPage from './AnalysisPage';
import ResultsDisplay from './ResultsDisplay';
import './LoansPage.css';

const LoansPage = () => {
  const [step, setStep] = useState('home');
  const [loanData, setLoanData] = useState(null);
  const [loanRequest, setLoanRequest] = useState({ amount: 500000, tenure: 24 });
  const [error, setError] = useState('');

  const handleHomeSubmit = (amount, tenure) => {
    setLoanRequest({ amount, tenure });
    setStep('upload');
  };

  const handleUploadSuccess = (data) => {
    setLoanData(data);
    setStep('results');
  };

  const handleUploadError = (errorMessage) => {
    setError(errorMessage);
    setStep('upload'); 
  };
  
  const handleStartAnalysis = () => {
    setStep('analysis');
  };

  const handleReset = () => {
    setStep('home');
    setLoanData(null);
    setError('');
  };

  const renderStep = () => {
    switch (step) {
      case 'home':
        return <HomePage onSubmit={handleHomeSubmit} />;
      case 'upload':
        return <UploadPage 
                  loanRequest={loanRequest} 
                  onSuccess={handleUploadSuccess} 
                  onError={handleUploadError} 
                  onStartAnalysis={handleStartAnalysis}
                  error={error}
                  onReset={handleReset}
               />;
      case 'analysis':
        return <AnalysisPage />;
      case 'results':
        return <ResultsDisplay data={loanData} onReset={handleReset} />;
      default:
        return <HomePage onSubmit={handleHomeSubmit} />;
    }
  };

  return (
    <div className="loans-page">
      {renderStep()}
    </div>
  );
};

export default LoansPage;
