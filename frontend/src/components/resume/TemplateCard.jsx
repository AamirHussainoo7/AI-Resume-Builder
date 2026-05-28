/**
 * TemplateCard — Template selection card with premium gating.
 * Premium templates show a lock icon for free users.
 */

import { Check, FileText, Crown, Lock } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function TemplateCard({ template, isSelected, onSelect }) {
  const { user } = useSelector((state) => state.auth);
  const { status: subStatus } = useSelector((state) => state.subscription);

  const isPremium = subStatus?.is_premium || user?.is_premium;
  const isAdmin = user?.is_staff;
  const isLocked = template.isPremium && !isPremium && !isAdmin;

  const handleClick = () => {
    if (isLocked) return;
    onSelect(template.id);
  };

  return (
    <button
      onClick={handleClick}
      className="relative w-full text-left transition-all duration-300"
      style={{
        background: 'var(--bg-secondary)',
        border: `2px solid ${isSelected ? template.color : isLocked ? 'var(--border-default)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: isSelected ? `0 0 20px ${template.color}20` : 'var(--shadow-sm)',
        opacity: isLocked ? 0.7 : 1,
        cursor: isLocked ? 'not-allowed' : 'pointer',
      }}
      id={`template-${template.id}`}
      title={isLocked ? 'Premium subscription required' : template.name}
    >
      {/* Premium badge */}
      {template.isPremium && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '6px',
            background: isLocked
              ? 'rgba(100, 100, 100, 0.9)'
              : 'rgba(245, 158, 11, 0.9)',
            color: 'white',
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.5px',
          }}
        >
          {isLocked ? <Lock size={9} /> : <Crown size={9} />}
          PRO
        </div>
      )}

      {/* Preview area */}
      <div
        className="h-28 flex items-center justify-center relative"
        style={{
          background: `linear-gradient(135deg, ${template.color}15 0%, ${template.color}08 100%)`,
        }}
      >
        <FileText size={32} style={{ color: template.color, opacity: isLocked ? 0.35 : 0.6 }} />

        {/* Lock overlay for premium templates */}
        {isLocked && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.04)',
            }}
          >
            <Lock size={24} style={{ color: 'var(--text-tertiary)', opacity: 0.6 }} />
          </div>
        )}

        {isSelected && (
          <div
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: template.color }}
          >
            <Check size={14} color="white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h4
          className="font-semibold text-sm"
          style={{
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {template.name}
          {template.isPremium && !isLocked && (
            <Crown size={12} style={{ color: '#f59e0b' }} />
          )}
        </h4>
        <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
          {isLocked ? 'Upgrade to unlock' : template.description}
        </p>
      </div>
    </button>
  );
}
