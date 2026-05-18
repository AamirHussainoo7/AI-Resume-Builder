/**
 * Landing Page — Premium marketing page with animated hero, features, stats, and CTA.
 */

import { Link } from 'react-router-dom';
import {
  Sparkles, FileText, Download, BarChart3, Zap, Shield,
  Layout, ArrowRight, Star, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { APP_NAME } from '../utils/constants';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Improvements',
    desc: 'Let AI enhance your resume bullet points with strong action verbs and quantified achievements.',
    gradient: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
  },
  {
    icon: BarChart3,
    title: 'ATS Score Analysis',
    desc: 'Get instant ATS compatibility scores with actionable recommendations to beat the bots.',
    gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
  },
  {
    icon: Layout,
    title: 'Multiple Templates',
    desc: 'Choose from Modern, Classic, and Minimal templates designed by professionals.',
    gradient: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
  },
  {
    icon: Download,
    title: 'PDF Export',
    desc: 'Download your polished resume as a beautifully formatted PDF, ready to submit.',
    gradient: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
  },
  {
    icon: Zap,
    title: 'Real-time Preview',
    desc: 'See your resume update in real-time as you type. What you see is what you get.',
    gradient: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Your data is encrypted and never shared. Full control over your information.',
    gradient: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
  },
];

const stats = [
  { value: '50K+', label: 'Resumes Created', icon: FileText },
  { value: '95%', label: 'ATS Pass Rate', icon: BarChart3 },
  { value: '3', label: 'Pro Templates', icon: Layout },
  { value: '4.9★', label: 'User Rating', icon: Star },
];

const steps = [
  {
    step: '01',
    title: 'Choose a Template',
    desc: 'Select from our professionally designed resume templates — Modern, Classic, or Minimal.',
  },
  {
    step: '02',
    title: 'Fill in Your Details',
    desc: 'Add your experience, education, skills, and projects. Our form guides you through each section.',
  },
  {
    step: '03',
    title: 'Enhance with AI & Download',
    desc: 'Use AI to improve your content, check your ATS score, then download your polished PDF resume.',
  },
];

const testimonials = [
  { name: 'Sarah K.', role: 'Software Engineer', text: 'Landed my dream job at a FAANG company. The ATS score feature was a game-changer!' },
  { name: 'Michael T.', role: 'Product Manager', text: 'The AI suggestions made my resume stand out from hundreds of applicants.' },
  { name: 'Priya M.', role: 'Data Scientist', text: 'Built a polished resume in 10 minutes. The templates are truly professional.' },
];

export default function Landing() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* ── Navbar ── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            height: '68px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={20} color="white" />
            </div>
            <span
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.5px',
              }}
            >
              {APP_NAME}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={toggleTheme}
              className="btn-ghost"
              style={{
                padding: '8px',
                borderRadius: '10px',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <Link
              to="/login"
              className="btn btn-ghost"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="btn btn-primary"
              style={{ fontSize: '14px', padding: '10px 22px' }}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="hero-section" style={{ position: 'relative' }}>
        {/* Floating Orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '80px 24px 100px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 18px',
                borderRadius: '9999px',
                marginBottom: '32px',
                fontSize: '13px',
                fontWeight: 500,
                background: 'var(--primary-50)',
                color: 'var(--primary-600)',
                border: '1px solid var(--primary-100)',
              }}
            >
              <Sparkles size={14} />
              AI-Powered Resume Building
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(40px, 6vw, 72px)',
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: '24px',
                color: 'var(--text-primary)',
                letterSpacing: '-2px',
              }}
            >
              Build Resumes That
              <br />
              <span className="gradient-text">Land Jobs</span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '18px',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                maxWidth: '580px',
                margin: '0 auto 40px',
              }}
            >
              Create ATS-optimized, beautifully designed resumes in minutes.
              Our AI helps you craft compelling content that gets you noticed by recruiters.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link
                to="/signup"
                className="btn btn-primary animate-gradient"
                id="hero-cta"
                style={{
                  fontSize: '16px',
                  padding: '14px 36px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #6366f1)',
                  backgroundSize: '200% 200%',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35)',
                }}
              >
                Start Building Free <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="btn btn-secondary"
                style={{
                  fontSize: '16px',
                  padding: '14px 36px',
                  borderRadius: '14px',
                }}
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Stats Row */}
          <div
            className="animate-fade-in-up"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginTop: '72px',
              animationDelay: '0.3s',
              animationFillMode: 'both',
            }}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div
                  className="gradient-text"
                  style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    marginBottom: '4px',
                    letterSpacing: '-1px',
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section
        style={{
          padding: '96px 24px',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-default)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div
              className="badge"
              style={{
                marginBottom: '16px',
                padding: '6px 16px',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              Features
            </div>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '16px',
                letterSpacing: '-1px',
              }}
            >
              Everything You Need to Succeed
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--text-secondary)',
                maxWidth: '500px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              Powerful tools to create, optimize, and manage your professional resumes.
            </p>
          </div>

          <div
            className="stagger-children"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px',
            }}
          >
            {features.map((feature) => (
              <div key={feature.title} className="feature-card">
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: feature.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    boxShadow: `0 4px 12px ${feature.gradient.includes('#818cf8') ? 'rgba(99,102,241,0.2)' : 'rgba(0,0,0,0.08)'}`,
                  }}
                >
                  <feature.icon size={22} color="white" />
                </div>
                <h3
                  style={{
                    fontSize: '17px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div
              className="badge"
              style={{
                marginBottom: '16px',
                padding: '6px 16px',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              How It Works
            </div>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-1px',
              }}
            >
              Three Simple Steps
            </h2>
          </div>

          <div
            className="stagger-children"
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {steps.map((item) => (
              <div key={item.step} className="step-card">
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'white',
                  }}
                >
                  {item.step}
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '17px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: '6px',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section
        style={{
          padding: '96px 24px',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-default)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div
              className="badge"
              style={{
                marginBottom: '16px',
                padding: '6px 16px',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              Testimonials
            </div>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-1px',
              }}
            >
              Loved by Professionals
            </h2>
          </div>

          <div
            className="stagger-children"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {testimonials.map((t) => (
              <div
                key={t.name}
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '28px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                  ))}
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    marginBottom: '20px',
                    fontStyle: 'italic',
                  }}
                >
                  "{t.text}"
                </p>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    {t.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{ padding: '96px 24px' }}>
        <div
          className="cta-section"
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            textAlign: 'center',
            padding: '64px 40px',
          }}
        >
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2
              style={{
                fontSize: 'clamp(24px, 4vw, 38px)',
                fontWeight: 700,
                color: 'white',
                marginBottom: '16px',
                letterSpacing: '-0.5px',
              }}
            >
              Ready to Build Your Perfect Resume?
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.6)',
                maxWidth: '480px',
                margin: '0 auto 32px',
                lineHeight: 1.6,
              }}
            >
              Join thousands of professionals who landed their dream jobs with {APP_NAME}.
            </p>
            <Link
              to="/signup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 36px',
                borderRadius: '14px',
                fontWeight: 600,
                fontSize: '16px',
                background: 'white',
                color: '#312e81',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
              }}
            >
              Get Started Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: '1px solid var(--border-default)',
          padding: '32px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={14} color="white" />
            </div>
            <span
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              {APP_NAME}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
            © {new Date().getFullYear()} {APP_NAME}. Built with ❤️ and AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
