/**
 * ResumeCard — Dashboard card showing resume title, template, and actions.
 */

import { useNavigate } from 'react-router-dom';
import { FileText, Edit3, Eye, Trash2, Clock } from 'lucide-react';
import { timeAgo } from '../../utils/helpers';

export default function ResumeCard({ resume, onDelete }) {
  const navigate = useNavigate();

  const templateColors = {
    modern: '#6366f1',
    classic: '#1a1a2e',
    minimal: '#64748b',
  };

  return (
    <div
      className="card p-0 overflow-hidden cursor-pointer group animate-fade-in-up"
      style={{ transition: 'all 0.3s ease' }}
    >
      {/* Template preview banner */}
      <div
        className="h-32 relative flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${templateColors[resume.template_name] || '#6366f1'}22 0%, ${templateColors[resume.template_name] || '#6366f1'}11 100%)`,
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <FileText
          size={40}
          style={{ color: templateColors[resume.template_name] || '#6366f1', opacity: 0.5 }}
        />
        <div
          className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium"
          style={{
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(8px)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-default)',
          }}
        >
          {resume.template_name}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="font-semibold text-base mb-1 truncate"
          style={{ color: 'var(--text-primary)' }}
        >
          {resume.title}
        </h3>

        {resume.full_name && (
          <p className="text-sm mb-2 truncate" style={{ color: 'var(--text-secondary)' }}>
            {resume.full_name}
          </p>
        )}

        <div
          className="flex items-center gap-1 text-xs mb-3"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <Clock size={12} />
          <span>{timeAgo(resume.updated_at)}</span>
        </div>

        {/* Stats badges */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {resume.experience_count > 0 && (
            <span className="badge text-xs">
              {resume.experience_count} exp
            </span>
          )}
          {resume.education_count > 0 && (
            <span className="badge text-xs">
              {resume.education_count} edu
            </span>
          )}
          {resume.project_count > 0 && (
            <span className="badge text-xs">
              {resume.project_count} proj
            </span>
          )}
        </div>

        {/* Actions */}
        <div
          className="flex items-center gap-1 pt-3"
          style={{ borderTop: '1px solid var(--border-default)' }}
        >
          <button
            onClick={() => navigate(`/resume/edit/${resume.id}`)}
            className="btn-ghost flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
            style={{ color: 'var(--primary-500)' }}
            id={`edit-resume-${resume.id}`}
          >
            <Edit3 size={14} /> Edit
          </button>
          <button
            onClick={() => navigate(`/resume/preview/${resume.id}`)}
            className="btn-ghost flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
            style={{ color: 'var(--text-secondary)' }}
            id={`preview-resume-${resume.id}`}
          >
            <Eye size={14} /> Preview
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(resume.id);
            }}
            className="btn-ghost py-2 px-2 rounded-lg"
            style={{ color: 'var(--error)' }}
            id={`delete-resume-${resume.id}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
