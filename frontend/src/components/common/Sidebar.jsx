/**
 * Sidebar — Collapsible navigation sidebar with active state.
 */

import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus,
  User,
  X,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/resume/new', label: 'New Resume', icon: FilePlus },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
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
          <button onClick={onClose} className="btn-ghost p-2 rounded-lg">
            <X size={20} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive ? 'sidebar-active' : 'sidebar-inactive'
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? 'var(--primary-50)' : 'transparent',
                color: isActive ? 'var(--primary-600)' : 'var(--text-secondary)',
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains('sidebar-active')) {
                  e.currentTarget.style.background = 'var(--bg-tertiary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.classList.contains('sidebar-active')) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-4 pb-6">
          <div
            className="p-4 rounded-xl"
            style={{
              background: 'var(--gradient-primary)',
              color: 'white',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} />
              <span className="font-semibold text-sm">AI Powered</span>
            </div>
            <p className="text-xs opacity-80 leading-relaxed">
              Improve your resume with AI-powered suggestions, ATS scoring, and smart summaries.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
