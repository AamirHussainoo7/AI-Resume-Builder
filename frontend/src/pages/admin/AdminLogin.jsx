/**
 * AdminLogin — Dedicated login page for admin portal.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { setTokens, setUser } from '../../redux/authSlice';
import adminService from '../../services/adminService';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await adminService.login({ email, password });
      // Store tokens and user info in Redux and localStorage
      dispatch(setTokens(data.tokens));
      dispatch(setUser(data.user));
      toast.success('Admin login successful');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: '20px',
    }}>
      <div style={{
        width: '100%', maxWidth: '420px', padding: '40px 36px',
        borderRadius: '24px', background: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', margin: '0 auto 16px',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
          }}>
            <Shield size={28} color="white" />
          </div>
          <h1 style={{
            fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)',
            letterSpacing: '-0.03em', marginBottom: '4px',
          }}>Admin Portal</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
            Restricted access — admin credentials required
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block', fontSize: '13px', fontWeight: 600,
              color: 'var(--text-secondary)', marginBottom: '6px',
            }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 16px', fontSize: '14px',
                borderRadius: '12px', background: 'var(--bg-primary)',
                border: '1.5px solid var(--border-default)',
                color: 'var(--text-primary)', outline: 'none',
                fontFamily: "'Inter', sans-serif",
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block', fontSize: '13px', fontWeight: 600,
              color: 'var(--text-secondary)', marginBottom: '6px',
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 44px 12px 16px', fontSize: '14px',
                  borderRadius: '12px', background: 'var(--bg-primary)',
                  border: '1.5px solid var(--border-default)',
                  color: 'var(--text-primary)', outline: 'none',
                  fontFamily: "'Inter', sans-serif",
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)',
                }}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{
              width: '100%', padding: '14px', borderRadius: '12px',
              fontSize: '15px', fontWeight: 700, gap: '8px',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <><Loader2 size={18} className="animate-spin" /> Signing in...</>
            ) : (
              <><Shield size={18} /> Sign In as Admin</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
