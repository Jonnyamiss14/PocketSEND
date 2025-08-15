import Link from 'next/link'
import { Shield, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        {/* Floating Accent Shapes */}
        <div className="hero-accent hero-accent--gold"></div>
        <div className="hero-accent hero-accent--teal"></div>
        
        <div className="container">
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center max-w-4xl animate-on-scroll">
              {/* Trust Badge */}
              <div className="mb-8">
                <div className="trust-badge trust-badge--secure">
                  <Shield className="w-4 h-4" />
                  <span>Trusted by 500+ Teaching Assistants</span>
                </div>
              </div>
              
              {/* Hero Headline */}
              <h1 className="display-hero mb-6">
                Prepare Teaching Assistants for
                <br />
                <span style={{ color: 'var(--brand-teal)' }}>Special Educational Needs</span>
              </h1>
              
              {/* Hero Subheading */}
              <p className="body-lead mb-12 max-w-3xl mx-auto animate-delay-1">
                Transform anxiety into confidence with AI-powered micro-learning delivered through WhatsApp. 
                Join the platform trusted by education agencies across the UK.
              </p>
              
              {/* Hero CTA */}
              <div className="flex flex-col gap-6 justify-center items-center animate-delay-2">
                <Link href="/candidate-signup" className="btn-gold">
                  Get Started as Candidate →
                </Link>
                <Link href="/login" className="btn-secondary">
                  Agency Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


    </>
  )
}
