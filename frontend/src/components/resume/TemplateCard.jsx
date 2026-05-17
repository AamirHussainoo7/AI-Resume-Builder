/**
 * TemplateCard — Template selection card with preview and select button.
 */

import { Check, FileText } from 'lucide-react';

export default function TemplateCard({ template, isSelected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(template.id)}
      className="relative w-full text-left transition-all duration-300"
      style={{
        background: 'var(--bg-secondary)',
        border: `2px solid ${isSelected ? template.color : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: isSelected ? `0 0 20px ${template.color}20` : 'var(--shadow-sm)',
      }}
      id={`template-${template.id}`}
    >
      {/* Preview area */}
      <div
        className="h-28 flex items-center justify-center relative"
        style={{
          background: `linear-gradient(135deg, ${template.color}15 0%, ${template.color}08 100%)`,
        }}
      >
        <FileText size={32} style={{ color: template.color, opacity: 0.6 }} />

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
          style={{ color: 'var(--text-primary)' }}
        >
          {template.name}
        </h4>
        <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
          {template.description}
        </p>
      </div>
    </button>
  );
}
