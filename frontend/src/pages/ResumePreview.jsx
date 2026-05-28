/**
 * ResumePreview — Full-page resume preview with ATS score and download.
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Download, Edit3, BarChart3, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/common/Navbar';
import ResumePreviewPanel from '../components/resume/ResumePreviewPanel';
import AIButton from '../components/ai/AIButton';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';
import { fetchResumeById } from '../redux/resumeSlice';
import aiService from '../services/aiService';
import pdfService from '../services/pdfService';

export default function ResumePreview() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentResume, isLoading } = useSelector((s) => s.resume);
  const previewRef = useRef(null);
  const [atsResult, setAtsResult] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsModal, setAtsModal] = useState(false);

  useEffect(() => { dispatch(fetchResumeById(id)); }, [id, dispatch]);

  const handleDownload = async () => {
    if (!currentResume) return;
    toast.loading('Generating PDF...', { id: 'pdf' });
    try {
      // Use server-side generation which tracks exports and enforces limits
      await pdfService.generatePDF(currentResume.id, currentResume.template_name);
      toast.success('PDF downloaded!', { id: 'pdf' });
      // Refresh subscription status to update export counter
      const { fetchSubscriptionStatus } = await import('../redux/subscriptionSlice');
      dispatch(fetchSubscriptionStatus());
    } catch (err) {
      const errorMsg = err?.response?.data?.error || 'Download failed';
      toast.error(errorMsg, { id: 'pdf' });
    }
  };

  const handleATSScore = async () => {
    setAtsLoading(true);
    try {
      const result = await aiService.getATSScore(id);
      setAtsResult(result);
      setAtsModal(true);
    } catch { toast.error('ATS analysis failed'); }
    setAtsLoading(false);
  };

  if (isLoading) return <Loader fullPage text="Loading preview..." />;
  if (!currentResume) return <Loader fullPage text="Resume not found" />;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-tertiary)' }}>
      <Navbar />

      {/* Action bar */}
      <div className="fixed top-16 left-0 right-0 z-30 flex items-center justify-between px-6 py-3"
        style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-default)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn btn-ghost text-sm"><ArrowLeft size={16} /> Back</button>
          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{currentResume.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <AIButton size="md" onClick={handleATSScore} isLoading={atsLoading}>
            <BarChart3 size={14} /> ATS Score
          </AIButton>
          <Link to={`/resume/edit/${id}`} className="btn btn-secondary text-sm"><Edit3 size={16} /> Edit</Link>
          <button onClick={handleDownload} className="btn btn-primary text-sm" id="download-preview-pdf"><Download size={16} /> Download PDF</button>
        </div>
      </div>

      {/* Preview */}
      <div className="pt-32 pb-12 px-4 flex justify-center">
        <div style={{ transform: 'scale(0.75)', transformOrigin: 'top center' }}>
          <ResumePreviewPanel ref={previewRef} resume={currentResume} />
        </div>
      </div>

      {/* ATS Score Modal */}
      <Modal isOpen={atsModal} onClose={() => setAtsModal(false)} title="ATS Compatibility Score" size="lg">
        {atsResult && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Score Circle */}
            <div className="flex items-center justify-center">
              <div className="w-28 h-28 rounded-full flex items-center justify-center" style={{
                background: `conic-gradient(${atsResult.score >= 70 ? 'var(--success)' : atsResult.score >= 40 ? 'var(--warning)' : 'var(--error)'} ${atsResult.score * 3.6}deg, var(--bg-tertiary) 0deg)`,
              }}>
                <div className="w-22 h-22 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-secondary)', width: '88px', height: '88px' }}>
                  <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{atsResult.score}</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {atsResult.recommendations?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Recommendations</h4>
                <ul className="space-y-2">
                  {atsResult.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--warning)' }}>•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Strengths */}
            {atsResult.strengths?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Strengths</h4>
                <ul className="space-y-1">
                  {atsResult.strengths.map((s, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--success)' }}>✓ {s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Keywords */}
            {atsResult.missing_keywords?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Add These Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {atsResult.missing_keywords.map((kw, i) => (
                    <span key={i} className="badge" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--error)' }}>{kw}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
