/**
 * Sidebar — Collapsible navigation sidebar with active state.
 */

import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus,
  User,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/resume/new', label: 'New Resume', icon: FilePlus },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={onClose}
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full flex flex-col transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          width: '260px',
          paddingTop: 'var(--navbar-height)',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-default)',
        }}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-end px-4 py-2 md:hidden">
          <button
            onClick={onClose}
            className="btn-ghost p-2 rounded-lg"
            style={{
              color: 'var(--text-secondary)',
              transition: 'all 0.2s ease',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  textDecoration: 'none',
                  position: 'relative',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)'
                    : 'transparent',
                  color: isActive ? 'var(--primary-500)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.15)' : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '-13px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '3px',
                      height: '24px',
                      borderRadius: '0 4px 4px 0',
                      background: 'var(--gradient-primary)',
                    }}
                  />
                )}
                <item.icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom section — AI promo card */}
        <div className="px-4 pb-5">
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              padding: '20px 16px',
              borderRadius: '16px',
              background: 'var(--gradient-primary)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
            }}
          >
            {/* Decorative circles */}
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-10px',
                left: '-10px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.2)',
                  }}
                >
                  <Zap size={14} />
                </div>
                <span style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.01em' }}>AI Powered</span>
              </div>
              <p style={{ fontSize: '12px', opacity: 0.85, lineHeight: '1.5' }}>
                Improve your resume with AI suggestions, ATS scoring, and smart summaries.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
