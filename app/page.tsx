import Link from 'next/link'
import { Shield, Users, BookOpen, CheckCircle, ArrowRight, Star } from 'lucide-react'

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
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-delay-2">
                <Link href="/candidate-signup" className="btn-gold">
                  Get Started as Candidate
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/login" className="btn-secondary">
                  Agency Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Path Selection Section */}
      <section style={{ background: 'var(--surface-white)', padding: '80px 0' }}>
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-xl mb-4">Choose Your Path</h2>
            <p className="body-lead">Whether you're a candidate preparing for SEN work or an agency managing placements, we have the perfect solution for you.</p>
          </div>
          
          <div className="grid grid--two-column max-w-5xl mx-auto">
            {/* Candidate Path */}
            <Link href="/candidate-signup" className="path-card path-card--candidate" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="flex items-center gap-3 mb-6">
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, var(--gold-accent) 0%, var(--gold-light) 100%)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <BookOpen className="w-6 h-6" style={{ color: 'var(--text-heading)' }} />
                </div>
                <div>
                  <h3 className="heading-lg mb-2">For Teaching Assistants</h3>
                  <p className="body-default" style={{ color: 'var(--text-muted)' }}>Get personalized SEN preparation</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: 'var(--success-green)', flexShrink: 0 }} />
                  <span className="body-default">WhatsApp-based micro-learning modules</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: 'var(--success-green)', flexShrink: 0 }} />
                  <span className="body-default">AI-powered personalized content</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: 'var(--success-green)', flexShrink: 0 }} />
                  <span className="body-default">Track your preparation progress</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: 'var(--success-green)', flexShrink: 0 }} />
                  <span className="body-default">Practice real-world scenarios</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="button-text" style={{ color: 'var(--gold-dark)' }}>Start Your Journey</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Free to get started</div>
                </div>
                <ArrowRight className="w-6 h-6" style={{ color: 'var(--gold-accent)' }} />
              </div>
            </Link>

            {/* Agency Path */}
            <Link href="/login" className="path-card path-card--agency" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="flex items-center gap-3 mb-6">
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, var(--brand-teal) 0%, var(--brand-teal-dark) 100%)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Users className="w-6 h-6" style={{ color: 'var(--text-inverse)' }} />
                </div>
                <div>
                  <h3 className="heading-lg mb-2">For Agencies</h3>
                  <p className="body-default" style={{ color: 'var(--text-muted)' }}>Manage candidate preparation</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: 'var(--success-green)', flexShrink: 0 }} />
                  <span className="body-default">Manage multiple candidates</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: 'var(--success-green)', flexShrink: 0 }} />
                  <span className="body-default">Automated WhatsApp delivery</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: 'var(--success-green)', flexShrink: 0 }} />
                  <span className="body-default">Real-time progress tracking</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: 'var(--success-green)', flexShrink: 0 }} />
                  <span className="body-default">School-specific training modules</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="button-text" style={{ color: 'var(--brand-teal-dark)' }}>Access Your Dashboard</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>New agency? <span style={{ color: 'var(--brand-teal)', textDecoration: 'underline' }}>Sign up here</span></div>
                </div>
                <ArrowRight className="w-6 h-6" style={{ color: 'var(--brand-teal)' }} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ background: 'var(--surface-light)', padding: '80px 0' }}>
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-xl mb-4">Why Choose PocketSEND?</h2>
            <p className="body-lead">Transform the way Teaching Assistants prepare for SEN placements with our innovative platform.</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, var(--brand-teal) 0%, var(--brand-teal-light) 100%)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 24px auto'
              }}>
                <BookOpen className="w-8 h-8" style={{ color: 'var(--text-inverse)' }} />
              </div>
              <h3 className="heading-lg mb-4">AI-Powered Learning</h3>
              <p className="body-default">Personalized preparation content delivered through intelligent micro-learning modules that adapt to each candidate's needs and learning pace.</p>
            </div>

            <div style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, var(--gold-accent) 0%, var(--gold-light) 100%)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 24px auto'
              }}>
                <Star className="w-8 h-8" style={{ color: 'var(--text-heading)' }} />
              </div>
              <h3 className="heading-lg mb-4">WhatsApp Integration</h3>
              <p className="body-default">Seamless delivery of training materials directly to candidates' phones through the messaging app they already use every day.</p>
            </div>

            <div style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, var(--success-green) 0%, var(--success-light) 100%)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 24px auto'
              }}>
                <Users className="w-8 h-8" style={{ color: 'var(--text-inverse)' }} />
              </div>
              <h3 className="heading-lg mb-4">Multi-Tenant Platform</h3>
              <p className="body-default">Complete B2B2C solution for recruitment agencies managing multiple candidates with comprehensive tracking and reporting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ background: 'var(--surface-white)', padding: '80px 0' }}>
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="heading-xl mb-4">Ready to Transform SEN Preparation?</h2>
            <p className="body-lead mb-8">Join hundreds of Teaching Assistants and agencies who are already using PocketSEND to achieve better outcomes in Special Educational Needs placements.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/candidate-signup" className="btn-primary">
                Start Learning Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/signup" className="btn-secondary">
                Partner with Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
