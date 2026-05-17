/**
 * Navbar — Top navigation bar with theme toggle and user dropdown.
 */

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Sun, Moon, User, LogOut, ChevronDown, FileText } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { logout } from '../../redux/authSlice';
import { APP_NAME } from '../../utils/constants';
import { getInitials } from '../../utils/helpers';

export default function Navbar({ onToggleSidebar }) {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
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
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <FileText size={18} color="white" />
          </div>
          <span
            className="text-lg font-bold hidden sm:block"
            style={{ color: 'var(--text-primary)' }}
          >
            {APP_NAME}
          </span>
        </Link>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn-ghost p-2 rounded-lg"
          id="theme-toggle"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{ color: 'var(--text-secondary)' }}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* User Dropdown */}
        {isAuthenticated && user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 btn-ghost px-3 py-2 rounded-lg"
              id="user-menu"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{
                  background: 'var(--gradient-primary)',
                  color: 'white',
                }}
              >
                {getInitials(user.name || user.username)}
              </div>
              <span
                className="text-sm font-medium hidden sm:block"
                style={{ color: 'var(--text-primary)' }}
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
                className="absolute right-0 mt-2 w-48 py-1 animate-fade-in-down"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => e.target.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <User size={16} />
                  Profile
                </Link>
                <div style={{ borderTop: '1px solid var(--border-default)', margin: '4px 0' }} />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left transition-colors"
                  style={{ color: 'var(--error)' }}
                  onMouseEnter={(e) => e.target.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
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
