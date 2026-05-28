/**
 * Navbar — Top navigation bar with theme toggle, premium badge, and user dropdown.
 */

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Sun, Moon, User, LogOut, ChevronDown, FileText, Crown, Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { logout } from '../../redux/authSlice';
import { APP_NAME } from '../../utils/constants';
import { getInitials } from '../../utils/helpers';

export default function Navbar({ onToggleSidebar }) {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { status: subStatus } = useSelector((state) => state.subscription);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isPremium = subStatus?.is_premium || user?.is_premium;
  const isAdmin = user?.is_staff;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6"
      style={{
        height: 'var(--navbar-height)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-default)',
      }}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <button
            onClick={onToggleSidebar}
            className="btn-ghost p-2 rounded-lg md:hidden"
            id="sidebar-toggle"
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          className="flex items-center gap-2.5"
          style={{ textDecoration: 'none' }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--gradient-primary)',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
            }}
          >
            <FileText size={18} color="white" />
          </div>
          <span
            className="hidden sm:block"
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
            }}
          >
            {APP_NAME}
          </span>
        </Link>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Premium Badge */}
        {isAuthenticated && isPremium && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 12px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(234, 179, 8, 0.06))',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              fontSize: '11px',
              fontWeight: 700,
              color: '#f59e0b',
              letterSpacing: '0.5px',
            }}
          >
            <Crown size={12} />
            PRO
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          id="theme-toggle"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'transparent',
            border: '1px solid transparent',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-tertiary)';
            e.currentTarget.style.borderColor = 'var(--border-default)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* User Dropdown */}
        {isAuthenticated && user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              id="user-menu"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '5px 12px 5px 5px',
                borderRadius: '14px',
                background: 'transparent',
                border: '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-tertiary)';
                e.currentTarget.style.borderColor = 'var(--border-default)';
              }}
              onMouseLeave={(e) => {
                if (!dropdownOpen) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                  background: isAdmin
                    ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                    : 'var(--gradient-primary)',
                  color: 'white',
                  letterSpacing: '0.02em',
                }}
              >
                {getInitials(user.name || user.username)}
              </div>
              <span
                className="hidden sm:block"
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                {user.name || user.username}
              </span>
              <ChevronDown
                size={14}
                style={{
                  color: 'var(--text-tertiary)',
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s',
                }}
              />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 animate-fade-in-down"
                style={{
                  width: '220px',
                  padding: '6px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-default)',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    fontSize: '14px',
                    fontWeight: 500,
                    borderRadius: '10px',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <User size={16} />
                  Profile
                </Link>

                {/* Upgrade link for non-premium, non-admin users */}
                {!isPremium && !isAdmin && (
                  <Link
                    to="/upgrade"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      fontSize: '14px',
                      fontWeight: 600,
                      borderRadius: '10px',
                      color: '#f59e0b',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(245, 158, 11, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <Crown size={16} />
                    Upgrade to Premium
                  </Link>
                )}

                {/* Admin Portal link */}
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      fontSize: '14px',
                      fontWeight: 600,
                      borderRadius: '10px',
                      color: '#6366f1',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(99, 102, 241, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <Shield size={16} />
                    Admin Portal
                  </Link>
                )}

                <div style={{
                  height: '1px',
                  background: 'var(--border-default)',
                  margin: '4px 8px',
                }} />
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    fontSize: '14px',
                    fontWeight: 500,
                    borderRadius: '10px',
                    width: '100%',
                    textAlign: 'left',
                    color: 'var(--error)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
