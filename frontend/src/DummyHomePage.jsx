import React, { useState, useEffect } from 'react';
import './DummyHomePage.css';

const DummyHomePage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="homepage">
      {/* Floating Particles */}
      <div className="particles">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`particle particle-${i + 1}`}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-background" />
        
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to FinSecure
          </h1>
          <p className="hero-description">
            Experience the future of financial services with our AI-powered document verification and loan processing platform. Secure, transparent, and lightning-fast.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" id="services">
        <div className="services-container">
          <h2 className="services-title">
            Our Services
          </h2>
          
          <div className="services-grid">
            {[
              {
                icon: "🏦",
                title: "Secure Banking Solutions",
                description: "Advanced encryption and AI-powered fraud detection ensure your financial data remains protected while providing seamless banking experiences.",
                iconClass: "service-icon-banking"
              },
              {
                icon: "⚡",
                title: "Quick Loan Processing",
                description: "Our automated document verification system processes loan applications in minutes, not days. Get instant eligibility checks and approvals.",
                iconClass: "service-icon-loan"
              },
              {
                icon: "🤖",
                title: "AI-Powered Financial Analysis",
                description: "Intelligent algorithms analyze your financial patterns to provide personalized insights and recommendations for better money management.",
                iconClass: "service-icon-ai"
              }
            ].map((service, index) => (
              <ServiceCard 
                key={service.title}
                {...service}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="ai-features" id="ai-features">
        <div className="ai-features-container">
          <h2 className="ai-features-title">
            Powered by Advanced AI
          </h2>
          <p className="ai-features-subtitle">
            Our cutting-edge technology revolutionizes traditional financial processes
          </p>
          
          <div className="feature-highlights">
            {[
              {
                title: "Smart Document Verification",
                description: "AI instantly verifies names, dates, and financial details across multiple documents"
              },
              {
                title: "Automated Salary Analysis", 
                description: "Intelligent tracking of salary credits and income consistency verification"
              },
              {
                title: "Real-time Risk Assessment",
                description: "Continuous monitoring and evaluation of loan eligibility and risk factors"
              },
              {
                title: "Fraud Detection",
                description: "Advanced pattern recognition prevents fraudulent applications and protects users"
              }
            ].map((feature, index) => (
              <FeatureCard 
                key={feature.title}
                {...feature}
                index={index}
              />
            ))}
          </div>
          
          <button 
            onClick={() => scrollToSection('loans')}
            className="cta-button"
          >
            Start Your Loan Application
          </button>
        </div>
      </section>
    </div>
  );
};

const ServiceCard = ({ icon, title, description, iconClass, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 600 + index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className={`service-card ${isVisible ? 'service-card-visible' : ''}`}>
      <div className="service-card-shine" />
      
      <div className={`service-icon ${iconClass}`}>
        {icon}
      </div>
      
      <h3 className="service-card-title">
        {title}
      </h3>
      
      <p className="service-card-description">
        {description}
      </p>
    </div>
  );
};

const FeatureCard = ({ title, description, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1200 + index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className={`feature-highlight ${isVisible ? 'feature-highlight-visible' : ''}`}>
      <h4 className="feature-highlight-title">
        {title}
      </h4>
      <p className="feature-highlight-description">
        {description}
      </p>
    </div>
  );
};

export default DummyHomePage;