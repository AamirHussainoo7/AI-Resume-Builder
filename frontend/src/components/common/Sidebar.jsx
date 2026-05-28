/**
 * Sidebar — Collapsible navigation sidebar with active state and upgrade CTA.
 */

import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  FilePlus,
  User,
  X,
  Crown,
  Zap,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/resume/new', label: 'New Resume', icon: FilePlus },
  { path: '/upgrade', label: 'Upgrade', icon: Crown },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { status: subStatus } = useSelector((state) => state.subscription);
  const isPremium = subStatus?.is_premium || user?.is_premium;
  const isAdmin = user?.is_staff;

  // Filter nav items — hide Upgrade for premium/admin users
  const filteredItems = navItems.filter((item) => {
    if (item.path === '/upgrade' && (isPremium || isAdmin)) return false;
    return true;
  });

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
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isUpgrade = item.path === '/upgrade';
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
                  color: isUpgrade
                    ? '#f59e0b'
                    : isActive
                      ? 'var(--primary-500)'
                      : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.15)' : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = isUpgrade
                      ? 'rgba(245, 158, 11, 0.06)'
                      : 'var(--bg-tertiary)';
                    e.currentTarget.style.color = isUpgrade ? '#f59e0b' : 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = isUpgrade ? '#f59e0b' : 'var(--text-secondary)';
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

        {/* Bottom section — Premium CTA or Status */}
        <div className="px-4 pb-5">
          {isPremium || isAdmin ? (
            /* Premium/Admin status card */
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                padding: '20px 16px',
                borderRadius: '16px',
                background: isPremium
                  ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                  : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white',
                boxShadow: isPremium
                  ? '0 4px 20px rgba(245, 158, 11, 0.3)'
                  : '0 4px 20px rgba(99, 102, 241, 0.3)',
              }}
            >
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
                    {isAdmin ? <Zap size={14} /> : <Crown size={14} />}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.01em' }}>
                    {isAdmin ? 'Admin Account' : 'Premium Active'}
                  </span>
                </div>
                <p style={{ fontSize: '12px', opacity: 0.85, lineHeight: '1.5' }}>
                  {isAdmin
                    ? 'Full access to all templates & unlimited exports.'
                    : `${subStatus?.days_remaining || 0} days remaining. Enjoy premium templates & unlimited exports.`
                  }
                </p>
              </div>
            </div>
          ) : (
            /* Upgrade CTA for free users */
            <button
              onClick={() => { navigate('/upgrade'); onClose(); }}
              style={{
                position: 'relative',
                overflow: 'hidden',
                padding: '20px 16px',
                borderRadius: '16px',
                background: 'var(--gradient-primary)',
                color: 'white',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                width: '100%',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease',
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
                    <Crown size={14} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.01em' }}>Go Premium</span>
                </div>
                <p style={{ fontSize: '12px', opacity: 0.85, lineHeight: '1.5' }}>
                  Unlock unlimited exports, premium templates, and more for just ₹99/mo.
                </p>
              </div>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
