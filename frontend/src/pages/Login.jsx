/**
 * Login Page — Email/password auth with split-screen design.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, FileText, LogIn } from 'lucide-react';
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
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left: Decorative */}
      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(99,102,241,0.2), transparent 60%)',
        }} />
        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
            <FileText size={40} color="white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome Back
          </h2>
          <p className="text-lg text-white/60 max-w-md">
            Continue building your professional resume with AI-powered tools.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--gradient-primary)' }}>
                <FileText size={18} color="white" />
              </div>
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {APP_NAME}
              </span>
            </Link>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Sign in to your account
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: 'var(--primary-500)', fontWeight: 500 }}>
                Create one free
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-1" id="login-form">
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

            <div className="relative">
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
                className="absolute right-3 top-9 btn-ghost p-1 rounded"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full py-3 mt-4"
              id="login-submit"
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
    </div>
  );
}
