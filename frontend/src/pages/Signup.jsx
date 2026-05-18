/**
 * Signup Page — Registration with name, email, username, password.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, FileText, UserPlus, Sparkles, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { register, clearError } from '../redux/authSlice';
import FormInput from '../components/common/FormInput';
import { APP_NAME } from '../utils/constants';
import { validateEmail, validatePassword } from '../utils/validators';

export default function Signup() {
  const [form, setForm] = useState({
    name: '', username: '', email: '', password: '', password_confirm: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((s) => s.auth);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.username.trim()) errs.username = 'Required';
    if (!validateEmail(form.email)) errs.email = 'Invalid email';
    const pw = validatePassword(form.password);
    if (pw) errs.password = pw;
    if (form.password !== form.password_confirm) errs.password_confirm = 'Mismatch';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const res = await dispatch(register(form));
    if (register.fulfilled.match(res)) { toast.success('Account created!'); navigate('/dashboard'); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
      {/* Left: Decorative Panel */}
      <div
        style={{
          display: 'none',
          width: '50%',
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--gradient-hero)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className="lg-show"
      >
        {/* Decorative orbs */}
        <div
          className="animate-orb"
          style={{
            position: 'absolute',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.15)',
            filter: 'blur(80px)',
            top: '15%',
            right: '10%',
          }}
        />
        <div
          className="animate-orb"
          style={{
            position: 'absolute',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'rgba(6, 182, 212, 0.1)',
            filter: 'blur(60px)',
            bottom: '15%',
            left: '15%',
            animationDelay: '3s',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 48px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
            }}
          >
            <FileText size={40} color="white" />
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: 700, color: 'white', marginBottom: '16px', letterSpacing: '-1px' }}>
            Start Your Journey
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', maxWidth: '380px', margin: '0 auto', lineHeight: 1.6 }}>
            Create your free account and build AI-powered resumes that get you hired.
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '40px' }}>
            {[Sparkles, Shield, UserPlus].map((Icon, i) => (
              <div
                key={i}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={18} color="rgba(255,255,255,0.4)" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
        }}
        className="signup-form-side"
      >
        <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: '460px' }}>
          <div style={{ marginBottom: '32px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', textDecoration: 'none' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FileText size={16} color="white" />
              </div>
              <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {APP_NAME}
              </span>
            </Link>
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              Create your account
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--primary-500)', fontWeight: 500 }}>Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} id="signup-form" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <FormInput label="Full Name" id="name" value={form.name} onChange={handleChange} placeholder="John Doe" error={errors.name} required />
              <FormInput label="Username" id="username" value={form.username} onChange={handleChange} placeholder="johndoe" error={errors.username} required />
            </div>
            <FormInput label="Email" id="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" error={errors.email} required />
            <div style={{ position: 'relative' }}>
              <FormInput label="Password" id="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Min 8 characters" error={errors.password} required />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="btn-ghost"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '36px',
                  padding: '4px',
                  borderRadius: '6px',
                  color: 'var(--text-tertiary)',
                }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <FormInput label="Confirm Password" id="password_confirm" type="password" value={form.password_confirm} onChange={handleChange} placeholder="Repeat password" error={errors.password_confirm} required />
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              id="signup-submit"
              style={{
                width: '100%',
                padding: '13px',
                marginTop: '4px',
                fontSize: '15px',
                borderRadius: '12px',
              }}
            >
              {isLoading ? <div className="spinner" style={{ borderTopColor: 'white' }} /> : <><UserPlus size={18} /> Create Account</>}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .lg-show { display: flex !important; }
          .signup-form-side { width: 50% !important; }
        }
      `}</style>
    </div>
  );
}
