/**
 * Login Page — Email/password auth with split-screen design.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, FileText, LogIn, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { login, clearError } from '../redux/authSlice';
import FormInput from '../components/common/FormInput';
import { APP_NAME } from '../utils/constants';
import { validateEmail } from '../utils/validators';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateEmail(form.email)) newErrors.email = 'Please enter a valid email.';
    if (!form.password) newErrors.password = 'Password is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    }
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
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.15)',
            filter: 'blur(80px)',
            top: '10%',
            left: '20%',
          }}
        />
        <div
          className="animate-orb"
          style={{
            position: 'absolute',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.12)',
            filter: 'blur(60px)',
            bottom: '20%',
            right: '10%',
            animationDelay: '2s',
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
            Welcome Back
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', maxWidth: '380px', margin: '0 auto', lineHeight: 1.6 }}>
            Continue building your professional resume with AI-powered tools.
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '40px' }}>
            {[Sparkles, FileText, LogIn].map((Icon, i) => (
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
        className="login-form-side"
      >
        <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '36px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '28px', textDecoration: 'none' }}>
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
              Sign in to your account
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: 'var(--primary-500)', fontWeight: 500 }}>
                Create one free
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} id="login-form" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <FormInput
              label="Email"
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
              required
            />

            <div style={{ position: 'relative' }}>
              <FormInput
                label="Password"
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                error={errors.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              id="login-submit"
              style={{
                width: '100%',
                padding: '13px',
                marginTop: '8px',
                fontSize: '15px',
                borderRadius: '12px',
              }}
            >
              {isLoading ? (
                <div className="spinner" style={{ borderTopColor: 'white' }} />
              ) : (
                <>
                  <LogIn size={18} /> Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .lg-show { display: flex !important; }
          .login-form-side { width: 50% !important; }
        }
      `}</style>
    </div>
  );
}
