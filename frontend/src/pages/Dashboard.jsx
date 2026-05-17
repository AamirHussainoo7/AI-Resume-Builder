/**
 * Dashboard — Shows user's resumes with create, edit, delete actions.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, FileText, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import ResumeCard from '../components/resume/ResumeCard';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import { fetchResumes, deleteResume } from '../redux/resumeSlice';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resumes, isLoading } = useSelector((s) => s.resume);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => { dispatch(fetchResumes()); }, [dispatch]);

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

  return (
    <div className="page-container">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="content-area p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {resumes.length} resume{resumes.length !== 1 ? 's' : ''} created
            </p>
          </div>
          <button
            onClick={() => navigate('/resume/new')}
            className="btn btn-primary"
            id="create-resume-btn"
          >
            <Plus size={18} /> New Resume
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search resumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
            id="search-resumes"
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <Loader text="Loading your resumes..." />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: 'var(--primary-50)', color: 'var(--primary-400)' }}>
              <FileText size={36} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              {searchQuery ? 'No resumes found' : 'No resumes yet'}
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              {searchQuery ? 'Try a different search term.' : 'Create your first AI-powered resume.'}
            </p>
            {!searchQuery && (
              <button onClick={() => navigate('/resume/new')} className="btn btn-primary">
                <Sparkles size={16} /> Create Your First Resume
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
            {filtered.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onDelete={(id) => setDeleteModal({ open: true, id })}
              />
            ))}
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
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Are you sure you want to delete this resume? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
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
