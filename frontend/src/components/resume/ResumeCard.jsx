/**
 * ResumeCard — Dashboard card showing resume title, template, and actions.
 */

import { useNavigate } from 'react-router-dom';
import { FileText, Edit3, Eye, Trash2, Clock, Briefcase, GraduationCap, FolderKanban } from 'lucide-react';
import { timeAgo } from '../../utils/helpers';

const templateThemes = {
  modern: { color: '#6366f1', label: 'Modern' },
  classic: { color: '#0ea5e9', label: 'Classic' },
  minimal: { color: '#64748b', label: 'Minimal' },
};

export default function ResumeCard({ resume, onDelete }) {
  const navigate = useNavigate();
  const t = templateThemes[resume.template_name] || templateThemes.modern;

  const cardStyle = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-default)',
    borderRadius: '20px',
    overflow: 'hidden',
    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-sm)',
  };

  return (
    <div
      className="group animate-fade-in-up"
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = `0 20px 40px -12px ${t.color}25, 0 8px 16px rgba(0,0,0,0.06)`;
        e.currentTarget.style.borderColor = `${t.color}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--border-default)';
      }}
    >
      {/* Template preview banner */}
      <div style={{
        height: '140px', position: 'relative', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(135deg, ${t.color}15 0%, ${t.color}08 50%, ${t.color}03 100%)`,
        borderBottom: '1px solid var(--border-default)', overflow: 'hidden',
      }}>
        {/* Dot pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(${t.color}12 1px, transparent 1px)`,
          backgroundSize: '20px 20px', opacity: 0.5,
        }} />
        {/* Decorative circle */}
        <div style={{
          position: 'absolute', top: '-20px', right: '-20px',
          width: '100px', height: '100px', borderRadius: '50%', background: `${t.color}10`,
        }} />

        {/* Icon */}
        <div style={{
          position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '64px', height: '64px', borderRadius: '16px',
          background: `${t.color}12`, border: `1px solid ${t.color}20`,
        }}>
          <FileText size={28} style={{ color: t.color, opacity: 0.8 }} />
        </div>

        {/* Badge */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px', padding: '4px 12px',
          borderRadius: '20px', fontSize: '11px', fontWeight: 600,
          background: 'var(--bg-glass)', backdropFilter: 'blur(8px)',
          color: t.color, border: `1px solid ${t.color}25`,
        }}>
          {t.label}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '18px 20px 6px' }}>
        <h3 style={{
          fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)',
          marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis',
          whiteSpace: 'nowrap', letterSpacing: '-0.01em',
        }}>
          {resume.title}
        </h3>

        {resume.full_name && (
          <p style={{
            fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {resume.full_name}
          </p>
        )}

        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '14px',
        }}>
          <Clock size={12} />
          <span>{timeAgo(resume.updated_at)}</span>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
          {resume.experience_count > 0 && (
            <StatBadge icon={Briefcase} count={resume.experience_count} label="exp" color="#6366f1" />
          )}
          {resume.education_count > 0 && (
            <StatBadge icon={GraduationCap} count={resume.education_count} label="edu" color="#10b981" />
          )}
          {resume.project_count > 0 && (
            <StatBadge icon={FolderKanban} count={resume.project_count} label="proj" color="#f59e0b" />
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', borderTop: '1px solid var(--border-default)' }}>
        <ActionBtn
          icon={Edit3} label="Edit" color="var(--primary-500)"
          hoverBg={`${t.color}08`}
          onClick={() => navigate(`/resume/edit/${resume.id}`)}
          id={`edit-resume-${resume.id}`}
          borderRight
        />
        <ActionBtn
          icon={Eye} label="Preview" color="var(--text-secondary)"
          hoverBg="var(--bg-tertiary)"
          onClick={() => navigate(`/resume/preview/${resume.id}`)}
          id={`preview-resume-${resume.id}`}
          borderRight
        />
        <ActionBtn
          icon={Trash2} color="var(--text-tertiary)"
          hoverColor="var(--error)" hoverBg="rgba(239, 68, 68, 0.06)"
          onClick={(e) => { e.stopPropagation(); onDelete(resume.id); }}
          id={`delete-resume-${resume.id}`}
          small
        />
      </div>
    </div>
  );
}

function StatBadge({ icon: Icon, count, label, color }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '3px 10px', fontSize: '11px', fontWeight: 600, borderRadius: '20px',
      background: `${color}14`, color, border: `1px solid ${color}20`,
    }}>
      <Icon size={11} /> {count} {label}
    </span>
  );
}

function ActionBtn({ icon: Icon, label, color, hoverBg, hoverColor, onClick, id, borderRight, small }) {
  return (
    <button
      onClick={onClick}
      id={id}
      style={{
        flex: small ? 'none' : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        padding: small ? '12px 16px' : '12px 0',
        fontSize: '13px', fontWeight: label ? 600 : 400, color,
        background: 'transparent', border: 'none', cursor: 'pointer',
        transition: 'all 0.2s ease',
        borderRight: borderRight ? '1px solid var(--border-default)' : 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = hoverBg || 'transparent';
        if (hoverColor) e.currentTarget.style.color = hoverColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = color;
      }}
    >
      <Icon size={14} /> {label}
    </button>
  );
}
