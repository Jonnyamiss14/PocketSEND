import Link from 'next/link'
import { CheckCircle, Clock, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* Header */}
      <header className="fixed-header">
        <div className="container">
          <div className="logo-section">
            <img src="/logo.svg" alt="PocketSEND" className="logo" />
          </div>
          <nav className="header-nav">
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#features" className="nav-link">Features</a>
            <Link href="/login" className="nav-link nav-link--agency">Agency Login</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          {/* Innovation Badge */}
          <div className="innovation-badge">
            <span className="badge-icon">🚀</span>
            <span className="badge-text">UK's First AI-Powered SEN Training</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="hero-headline">
            Become <span className="highlight-gold">SEN confident</span> in no time.
          </h1>
          
          {/* Sub-headline */}
          <p className="hero-subheadline">
            Master real classroom scenarios through AI roleplay, bite-sized lessons, 
            and your personal SEN mentor.
          </p>
          
          {/* Value Propositions Grid */}
          <div className="value-props">
            <div className="value-card">
              <div className="value-icon">🎭</div>
              <h3 className="value-title">Practice Real Scenarios</h3>
              <p className="value-description">
                Role-play challenging situations before you face them
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">📱</div>
              <h3 className="value-title">Learn on Your Phone</h3>
              <p className="value-description">
                Daily 5-min lessons that fit your commute
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">🤖</div>
              <h3 className="value-title">24/7 AI Mentor</h3>
              <p className="value-description">
                Get instant answers to any SEN question
              </p>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="cta-section">
            <Link href="/candidate-signup" className="btn-primary btn-large">
              Start Today 
              <span className="btn-arrow">→</span>
            </Link>
            <p className="cta-subtext">
              No app downloads. No lengthy courses. Just confidence.
            </p>
          </div>
          
          {/* Trust Indicators */}
          <div className="trust-indicators">
            <span className="trust-badge">
              <CheckCircle className="w-4 h-4" />
              WhatsApp Based
            </span>
            <span className="trust-badge">
              <Clock className="w-4 h-4" />
              5 Minutes Daily
            </span>
            <span className="trust-badge">
              <Shield className="w-4 h-4" />
              Built with UK Educators
            </span>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="hero-decoration hero-decoration--left"></div>
        <div className="hero-decoration hero-decoration--right"></div>
      </section>
    </>
  )
}