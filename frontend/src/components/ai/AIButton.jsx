/**
 * AIButton — Gradient button with sparkle icon for AI actions.
 */

import { Sparkles } from 'lucide-react';

export default function AIButton({
  onClick,
  children,
  isLoading = false,
  disabled = false,
  size = 'md',
  className = '',
}) {
  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '12px' },
    md: { padding: '8px 16px', fontSize: '13px' },
    lg: { padding: '10px 20px', fontSize: '14px' },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-200 ${className}`}
      style={{
        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #06b6d4 100%)',
        color: 'white',
        border: 'none',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)',
        ...sizeStyles[size],
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.5)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(99, 102, 241, 0.3)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {isLoading ? (
        <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2, borderTopColor: 'white' }} />
      ) : (
        <Sparkles size={size === 'sm' ? 12 : 14} />
      )}
      {children}
    </button>
  );
}
