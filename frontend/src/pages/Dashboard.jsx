/**
 * Dashboard — Shows user's resumes with create, edit, delete actions.
 * Includes subscription status card and export tracking.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Plus, Search, FileText, Sparkles, LayoutGrid, TrendingUp,
  Crown, Zap, Download, Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import ResumeCard from '../components/resume/ResumeCard';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import { fetchResumes, deleteResume } from '../redux/resumeSlice';
import { fetchSubscriptionStatus, fetchExportHistory } from '../redux/subscriptionSlice';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resumes, isLoading } = useSelector((s) => s.resume);
  const { user } = useSelector((s) => s.auth);
  const { status: subStatus, exportHistory } = useSelector((s) => s.subscription);

  useEffect(() => {
    dispatch(fetchResumes());
    dispatch(fetchSubscriptionStatus());
    dispatch(fetchExportHistory());
  }, [dispatch]);

  const filtered = resumes.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    const res = await dispatch(deleteResume(deleteModal.id));
    if (deleteResume.fulfilled.match(res)) {
      toast.success('Resume deleted');
    }
    setDeleteModal({ open: false, id: null });
  };

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="page-container">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="content-area" style={{ padding: '32px 36px' }}>
        {/* Header section */}
        <div className="animate-fade-in-up" style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start',
          justifyContent: 'space-between', gap: '20px', marginBottom: '32px',
        }}>
          <div>
            <h1 style={{
              fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)',
              letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '6px',
            }}>
              Welcome back, {firstName} <span style={{ display: 'inline-block', animation: 'float 2s ease-in-out infinite' }}>👋</span>
            </h1>
            <p style={{
              fontSize: '15px', color: 'var(--text-secondary)', display: 'flex',
              alignItems: 'center', gap: '6px',
            }}>
              <LayoutGrid size={15} />
              {resumes.length} resume{resumes.length !== 1 ? 's' : ''} created
            </p>
          </div>

          <button
            onClick={() => navigate('/resume/new')}
            className="btn btn-primary"
            id="create-resume-btn"
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '14px',
              gap: '8px',
            }}
          >
            <Plus size={18} /> New Resume
          </button>
        </div>

        {/* Subscription Status + Quick Stats */}
        <div className="animate-fade-in-up" style={{
          display: 'flex', gap: '16px', marginBottom: '28px',
          animationDelay: '0.05s', flexWrap: 'wrap',
        }}>
          {/* Subscription Card */}
          <div
            onClick={() => !subStatus?.is_premium && navigate('/upgrade')}
            style={{
              flex: '1 1 200px', maxWidth: '300px', display: 'flex', alignItems: 'center', gap: '14px',
              padding: '16px 20px', borderRadius: '16px', cursor: subStatus?.is_premium ? 'default' : 'pointer',
              background: subStatus?.is_premium
                ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(234, 179, 8, 0.04))'
                : 'var(--bg-secondary)',
              border: subStatus?.is_premium
                ? '1px solid rgba(245, 158, 11, 0.2)'
                : '1px solid var(--border-default)',
              transition: 'all 0.25s ease',
            }}
          >
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: subStatus?.is_premium ? 'rgba(245, 158, 11, 0.15)' : 'rgba(99, 102, 241, 0.12)',
              color: subStatus?.is_premium ? '#f59e0b' : '#6366f1',
            }}>
              {subStatus?.is_premium ? <Crown size={20} /> : <Zap size={20} />}
            </div>
            <div>
              <div style={{
                fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                {subStatus?.is_premium ? 'Premium' : 'Free Plan'}
                {subStatus?.is_premium && (
                  <span style={{
                    fontSize: '10px', padding: '2px 8px', borderRadius: '20px',
                    background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b',
                    fontWeight: 700,
                  }}>ACTIVE</span>
                )}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                {subStatus?.is_premium
                  ? `${subStatus.days_remaining} days remaining`
                  : 'Upgrade for unlimited exports'
                }
              </div>
            </div>
          </div>

          {/* Export Counter */}
          <QuickStat
            label="Exports Used"
            value={subStatus?.is_premium ? '∞' : `${subStatus?.free_exports_used || 0}/${subStatus?.free_exports_limit || 3}`}
            color="#10b981"
            icon={Download}
            isText={subStatus?.is_premium}
          />

          {/* Resumes Count */}
          <QuickStat label="Total Resumes" value={resumes.length} color="#6366f1" icon={FileText} />

          {/* Templates Used */}
          <QuickStat
            label="Templates Used"
            value={new Set(resumes.map(r => r.template_name)).size}
            color="#8b5cf6"
            icon={LayoutGrid}
          />
        </div>

        {/* Upgrade Banner for free users */}
        {subStatus && !subStatus.is_premium && subStatus.free_exports_remaining <= 1 && (
          <div className="animate-fade-in-up" style={{
            padding: '18px 24px', borderRadius: '16px', marginBottom: '24px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.05))',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={18} style={{ color: '#6366f1' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {subStatus.free_exports_remaining === 0
                  ? 'You\'ve used all free exports this month!'
                  : 'Only 1 free export remaining this month!'
                }
              </span>
            </div>
            <button
              onClick={() => navigate('/upgrade')}
              className="btn btn-primary"
              style={{ padding: '8px 20px', fontSize: '13px', fontWeight: 600, borderRadius: '10px', gap: '6px' }}
            >
              <Crown size={14} /> Upgrade to Premium
            </button>
          </div>
        )}

        {/* Search */}
        <div className="animate-fade-in-up" style={{
          position: 'relative', marginBottom: '28px', maxWidth: '420px',
          animationDelay: '0.1s',
        }}>
          <Search
            size={16}
            style={{
              position: 'absolute', left: '14px', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-tertiary)', zIndex: 1,
            }}
          />
          <input
            type="text"
            placeholder="Search resumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search-resumes"
            style={{
              width: '100%', padding: '12px 14px 12px 42px',
              fontSize: '14px', fontFamily: "'Inter', sans-serif",
              color: 'var(--text-primary)', background: 'var(--bg-secondary)',
              border: '1.5px solid var(--border-default)', borderRadius: '14px',
              outline: 'none', transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--border-focus)';
              e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-default)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <Loader text="Loading your resumes..." />
        ) : filtered.length === 0 ? (
          <div className="animate-fade-in" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '80px 20px',
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(99, 102, 241, 0.08)', marginBottom: '24px',
              border: '1px solid rgba(99, 102, 241, 0.12)',
            }}>
              <FileText size={36} style={{ color: 'var(--primary-400)' }} />
            </div>
            <h3 style={{
              fontSize: '20px', fontWeight: 700, marginBottom: '8px',
              color: 'var(--text-primary)', letterSpacing: '-0.02em',
            }}>
              {searchQuery ? 'No resumes found' : 'No resumes yet'}
            </h3>
            <p style={{
              fontSize: '14px', marginBottom: '24px', color: 'var(--text-secondary)',
              maxWidth: '300px', textAlign: 'center', lineHeight: 1.6,
            }}>
              {searchQuery ? 'Try a different search term.' : 'Create your first AI-powered resume and land your dream job.'}
            </p>
            {!searchQuery && (
              <button onClick={() => navigate('/resume/new')} className="btn btn-primary" style={{
                padding: '12px 28px', borderRadius: '14px', fontSize: '14px', fontWeight: 600,
              }}>
                <Sparkles size={16} /> Create Your First Resume
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px',
          }}
          className="stagger-children"
          >
            {filtered.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onDelete={(id) => setDeleteModal({ open: true, id })}
              />
            ))}
          </div>
        )}

        {/* Export History */}
        {exportHistory && exportHistory.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h3 style={{
              fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)',
              marginBottom: '16px', letterSpacing: '-0.02em',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <Clock size={16} /> Recent Exports
            </h3>
            <div style={{
              borderRadius: '16px', overflow: 'hidden',
              border: '1px solid var(--border-default)',
            }}>
              {exportHistory.slice(0, 5).map((exp, i) => (
                <div key={exp.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 20px', background: 'var(--bg-secondary)',
                  borderBottom: i < Math.min(exportHistory.length, 5) - 1 ? '1px solid var(--border-default)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={15} style={{ color: 'var(--text-tertiary)' }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {exp.resume_title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                        {exp.template_name} template · {new Date(exp.exported_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {exp.is_premium_export && (
                    <Crown size={13} style={{ color: '#f59e0b' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        title="Delete Resume"
        size="sm"
      >
        <p style={{ fontSize: '14px', marginBottom: '24px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Are you sure you want to delete this resume? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={() => setDeleteModal({ open: false, id: null })}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

/* ---------- Helper Components ---------- */

function QuickStat({ label, value, color, icon: Icon, isText }) {
  return (
    <div style={{
      flex: '1 1 160px', maxWidth: '260px', display: 'flex', alignItems: 'center', gap: '14px',
      padding: '16px 20px', borderRadius: '16px',
      background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
      transition: 'all 0.25s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = `${color}40`;
      e.currentTarget.style.boxShadow = `0 4px 16px ${color}12`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--border-default)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <div style={{
        width: '42px', height: '42px', borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${color}14`, color,
      }}>
        <Icon size={20} />
      </div>
      <div>
        <div style={{
          fontSize: isText ? '13px' : '22px', fontWeight: isText ? 600 : 800,
          color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2,
        }}>
          {value}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
          {label}
        </div>
      </div>
    </div>
  );
}
