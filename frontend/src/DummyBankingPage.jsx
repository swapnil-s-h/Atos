// DummyBankingPage.jsx
import React, { useEffect } from 'react';
import './DummyBankingPage.css';

const DummyBankingPage = () => {
  useEffect(() => {
    // Add loading animations
    const animatedElements = document.querySelectorAll('.loading-animation');
    
    animatedElements.forEach((el, index) => {
      setTimeout(() => {
        el.style.animationDelay = `${index * 0.1}s`;
      }, index * 100);
    });

    // Smooth scrolling for navigation links
    const handleAnchorClick = (e) => {
      e.preventDefault();
      const target = document.querySelector(e.target.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick);
    });

    // Add dynamic background particles effect
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.width = '4px';
      particle.style.height = '4px';
      particle.style.background = 'rgba(255, 255, 255, 0.1)';
      particle.style.borderRadius = '50%';
      particle.style.left = Math.random() * window.innerWidth + 'px';
      particle.style.top = window.innerHeight + 'px';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '1';
      
      document.body.appendChild(particle);
      
      const animation = particle.animate([
        { transform: 'translateY(0px)', opacity: 0 },
        { transform: 'translateY(-100px)', opacity: 1 },
        { transform: 'translateY(' + (-window.innerHeight - 100) + 'px)', opacity: 0 }
      ], {
        duration: 3000 + Math.random() * 2000,
        easing: 'linear'
      });
      
      animation.onfinish = () => particle.remove();
    };

    // Create particles periodically
    const particleInterval = setInterval(createParticle, 300);

    // Cleanup function
    return () => {
      clearInterval(particleInterval);
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
    };
  }, []);

  const handleNavClick = (section) => {
    console.log(`Navigate to ${section}`);
    // Add your navigation logic here
  };

  const handleCTAClick = () => {
    console.log('Start Banking Today clicked');
    // Add your CTA logic here
  };

  return (
    <div className="banking-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>Banking Services</h1>
          <p>Experience seamless, secure, and intelligent banking powered by advanced AI technology</p>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card loading-animation">
            <div className="stat-icon">💰</div>
            <div className="stat-value">$12,450</div>
            <div className="stat-label">Available Balance</div>
          </div>
          <div className="stat-card loading-animation">
            <div className="stat-icon">📈</div>
            <div className="stat-value">+5.2%</div>
            <div className="stat-label">Monthly Growth</div>
          </div>
          <div className="stat-card loading-animation">
            <div className="stat-icon">⚡</div>
            <div className="stat-value">24/7</div>
            <div className="stat-label">AI Monitoring</div>
          </div>
          <div className="stat-card loading-animation">
            <div className="stat-icon">🔒</div>
            <div className="stat-value">100%</div>
            <div className="stat-label">Secure</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <button className="cta-button" onClick={handleCTAClick}>
            Start Banking Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default DummyBankingPage;