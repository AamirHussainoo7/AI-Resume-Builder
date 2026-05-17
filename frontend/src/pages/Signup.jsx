/**
 * Signup Page — Registration with name, email, username, password.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, FileText, UserPlus } from 'lucide-react';
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
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 70% 50%, rgba(139,92,246,0.2), transparent 60%)' }} />
        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
            <FileText size={40} color="white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Start Your Journey</h2>
          <p className="text-lg text-white/60 max-w-md">Create your free account and build AI-powered resumes.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}><FileText size={18} color="white" /></div>
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{APP_NAME}</span>
            </Link>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Create your account</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Already have an account? <Link to="/login" style={{ color: 'var(--primary-500)' }}>Sign in</Link></p>
          </div>

          <form onSubmit={handleSubmit} id="signup-form">
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Full Name" id="name" value={form.name} onChange={handleChange} placeholder="John Doe" error={errors.name} required />
              <FormInput label="Username" id="username" value={form.username} onChange={handleChange} placeholder="johndoe" error={errors.username} required />
            </div>
            <FormInput label="Email" id="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" error={errors.email} required />
            <div className="relative">
              <FormInput label="Password" id="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Min 8 characters" error={errors.password} required />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-9 btn-ghost p-1 rounded" style={{ color: 'var(--text-tertiary)' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <FormInput label="Confirm Password" id="password_confirm" type="password" value={form.password_confirm} onChange={handleChange} placeholder="Repeat password" error={errors.password_confirm} required />
            <button type="submit" disabled={isLoading} className="btn btn-primary w-full py-3 mt-2" id="signup-submit">
              {isLoading ? <div className="spinner" style={{ borderTopColor: 'white' }} /> : <><UserPlus size={18} /> Create Account</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
