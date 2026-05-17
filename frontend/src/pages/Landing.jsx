/**
 * Landing Page — Public marketing page with hero, features, and CTA.
 */

import { Link } from 'react-router-dom';
import {
  Sparkles, FileText, Download, BarChart3, Zap, Shield,
  Layout, ArrowRight, Star, CheckCircle2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { APP_NAME } from '../utils/constants';

const features = [
  { icon: Sparkles, title: 'AI-Powered Improvements', desc: 'Let AI enhance your resume bullet points with strong action verbs and quantified achievements.' },
  { icon: BarChart3, title: 'ATS Score Analysis', desc: 'Get instant ATS compatibility scores with actionable recommendations to beat the bots.' },
  { icon: Layout, title: 'Multiple Templates', desc: 'Choose from Modern, Classic, and Minimal templates designed by professionals.' },
  { icon: Download, title: 'PDF Export', desc: 'Download your polished resume as a beautifully formatted PDF, ready to submit.' },
  { icon: Zap, title: 'Real-time Preview', desc: 'See your resume update in real-time as you type. What you see is what you get.' },
  { icon: Shield, title: 'Secure & Private', desc: 'Your data is encrypted and never shared. Full control over your information.' },
];

const stats = [
  { value: '50K+', label: 'Resumes Created' },
  { value: '95%', label: 'ATS Pass Rate' },
  { value: '3', label: 'Pro Templates' },
  { value: '4.9★', label: 'User Rating' },
];

export default function Landing() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <FileText size={20} color="white" />
          </div>
          <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {APP_NAME}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="btn-ghost p-2 rounded-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <Link to="/login" className="btn btn-ghost text-sm">
            Log In
          </Link>
          <Link to="/signup" className="btn btn-primary text-sm">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute top-40 left-10 w-72 h-72 rounded-full -z-10 animate-float"
          style={{ background: 'rgba(139,92,246,0.06)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute top-60 right-10 w-96 h-96 rounded-full -z-10"
          style={{ background: 'rgba(6,182,212,0.05)', filter: 'blur(80px)', animationDelay: '1s' }}
        />

        <div className="max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
          <div className="animate-fade-in-up">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
              style={{
                background: 'var(--primary-50)',
                color: 'var(--primary-600)',
                border: '1px solid var(--primary-100)',
              }}
            >
              <Sparkles size={14} />
              AI-Powered Resume Building
            </div>

            <h1
              className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Build Resumes That{' '}
              <span
                style={{
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Land Jobs
              </span>
            </h1>

            <p
              className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Create ATS-optimized, beautifully designed resumes in minutes.
              Our AI helps you craft compelling content that gets you noticed by recruiters.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                to="/signup"
                className="btn btn-primary text-base px-8 py-3 gap-2"
                id="hero-cta"
              >
                Start Building Free <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="btn btn-secondary text-base px-8 py-3"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-3xl font-bold mb-1"
                  style={{
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-24 px-6"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Everything You Need to Succeed
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Powerful tools to create, optimize, and manage your professional resumes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-card p-6 hover:scale-[1.02] transition-transform duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: 'var(--primary-50)',
                    color: 'var(--primary-500)',
                  }}
                >
                  <feature.icon size={22} />
                </div>
                <h3
                  className="font-semibold text-lg mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Three Simple Steps
            </h2>
          </div>

          <div className="space-y-8 stagger-children">
            {[
              { step: '01', title: 'Choose a Template', desc: 'Select from our professionally designed resume templates — Modern, Classic, or Minimal.' },
              { step: '02', title: 'Fill in Your Details', desc: 'Add your experience, education, skills, and projects. Our form guides you through each section.' },
              { step: '03', title: 'Enhance with AI & Download', desc: 'Use AI to improve your content, check your ATS score, then download your polished PDF resume.' },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-6 items-start card p-6"
              >
                <div
                  className="text-2xl font-bold shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'var(--gradient-primary)',
                    color: 'white',
                  }}
                >
                  {item.step}
                </div>
                <div>
                  <h3
                    className="font-semibold text-lg mb-1"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div
          className="max-w-4xl mx-auto text-center p-12 rounded-3xl"
          style={{ background: 'var(--gradient-hero)' }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Build Your Perfect Resume?
          </h2>
          <p className="text-lg mb-8 text-white/70 max-w-xl mx-auto">
            Join thousands of professionals who landed their dream jobs with {APP_NAME}.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-base transition-all hover:scale-105"
            style={{
              background: 'white',
              color: '#312e81',
            }}
          >
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-6 text-center text-sm"
        style={{
          borderTop: '1px solid var(--border-default)',
          color: 'var(--text-tertiary)',
        }}
      >
        <p>© {new Date().getFullYear()} {APP_NAME}. Built with ❤️ and AI.</p>
      </footer>
    </div>
  );
}
