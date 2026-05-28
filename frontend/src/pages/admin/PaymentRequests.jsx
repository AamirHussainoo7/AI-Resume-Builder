/**
 * PaymentRequests — Admin page to review, approve, or reject payments.
 */

import { useState, useEffect } from 'react';
import {
  Search, CheckCircle, XCircle, Eye, Clock,
  ChevronDown, Loader2, ImageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import { AdminLayout, StatusBadge } from './AdminDashboard';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';

export default function PaymentRequests() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [rejectModal, setRejectModal] = useState({ open: false, id: null });
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadPayments();
  }, [statusFilter, search]);

  const loadPayments = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const data = await adminService.getPayments(params);
      setPayments(data.results || data);
    } catch (err) {
      toast.error('Failed to load payments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await adminService.approvePayment(id);
      toast.success('Payment approved! User is now Premium.');
      loadPayments();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Approval failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    setActionLoading(rejectModal.id);
    try {
      await adminService.rejectPayment(rejectModal.id, rejectReason);
      toast.success('Payment rejected');
      setRejectModal({ open: false, id: null });
      setRejectReason('');
      loadPayments();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Rejection failed');
    } finally {
      setActionLoading(null);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  const BASE_URL = API_URL.replace('/api', '');

  return (
    <AdminLayout active="payments">
      <div className="animate-fade-in-up">
        <h1 style={{
          fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)',
          letterSpacing: '-0.03em', marginBottom: '6px',
        }}>Payment Requests</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Review and verify user payment submissions
        </p>

        {/* Filters */}
        <div style={{
          display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap',
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '320px' }}>
            <Search size={15} style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-tertiary)',
            }} />
            <input
              type="text"
              placeholder="Search email, name, or txn ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px 10px 38px', fontSize: '13px',
                borderRadius: '10px', background: 'var(--bg-secondary)',
                border: '1px solid var(--border-default)', outline: 'none',
                color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif",
              }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ position: 'relative' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '10px 36px 10px 14px', fontSize: '13px', fontWeight: 500,
                borderRadius: '10px', background: 'var(--bg-secondary)',
                border: '1px solid var(--border-default)', outline: 'none',
                color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif",
                cursor: 'pointer', appearance: 'none',
              }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown size={14} style={{
              position: 'absolute', right: '12px', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-tertiary)',
              pointerEvents: 'none',
            }} />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <Loader text="Loading payments..." />
        ) : payments.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            color: 'var(--text-tertiary)', fontSize: '14px',
          }}>
            <Clock size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p>No payment requests found</p>
          </div>
        ) : (
          <div style={{
            borderRadius: '16px', overflow: 'hidden',
            border: '1px solid var(--border-default)',
          }}>
            {/* Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 0.8fr 1.4fr',
              gap: '12px', padding: '12px 20px', background: 'var(--bg-tertiary)',
              fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)',
              textTransform: 'uppercase', letterSpacing: '1px',
            }}>
              <span>User</span>
              <span>Transaction ID</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {/* Rows */}
            {payments.map((p) => (
              <div key={p.id} style={{
                display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 0.8fr 1.4fr',
                gap: '12px', padding: '14px 20px', alignItems: 'center',
                background: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border-default)',
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {p.user_name || p.user_email}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    {p.user_email} {p.user_phone ? `· ${p.user_phone}` : ''}
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  {p.transaction_id}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  ₹{p.amount}
                </div>
                <StatusBadge status={p.status} />
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {/* View Screenshot */}
                  <button
                    onClick={() => setSelectedPayment(p)}
                    title="View details"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      padding: '6px 10px', borderRadius: '8px', fontSize: '11px',
                      fontWeight: 600, background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-default)', cursor: 'pointer',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <Eye size={13} /> View
                  </button>

                  {p.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(p.id)}
                        disabled={actionLoading === p.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          padding: '6px 10px', borderRadius: '8px', fontSize: '11px',
                          fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.2)', cursor: 'pointer',
                          color: '#10b981',
                        }}
                      >
                        {actionLoading === p.id ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectModal({ open: true, id: p.id })}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          padding: '6px 10px', borderRadius: '8px', fontSize: '11px',
                          fontWeight: 600, background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer',
                          color: '#ef4444',
                        }}
                      >
                        <XCircle size={13} /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Payment Detail Modal */}
      <Modal
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        title="Payment Details"
        size="md"
      >
        {selectedPayment && (
          <div>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px',
              marginBottom: '20px',
            }}>
              <InfoRow label="Name" value={selectedPayment.user_name} />
              <InfoRow label="Email" value={selectedPayment.user_email} />
              <InfoRow label="Phone" value={selectedPayment.user_phone || '—'} />
              <InfoRow label="Amount" value={`₹${selectedPayment.amount}`} />
              <InfoRow label="Transaction ID" value={selectedPayment.transaction_id} mono />
              <InfoRow label="Status" value={selectedPayment.status} />
              <InfoRow label="Submitted" value={new Date(selectedPayment.submitted_at).toLocaleString()} />
              {selectedPayment.reviewed_at && (
                <InfoRow label="Reviewed" value={new Date(selectedPayment.reviewed_at).toLocaleString()} />
              )}
            </div>

            {selectedPayment.rejection_reason && (
              <div style={{
                padding: '12px 16px', borderRadius: '10px', marginBottom: '16px',
                background: 'rgba(239, 68, 68, 0.06)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                fontSize: '13px', color: '#ef4444',
              }}>
                <strong>Rejection Reason:</strong> {selectedPayment.rejection_reason}
              </div>
            )}

            {/* Screenshot */}
            <div style={{
              fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}>Payment Screenshot</div>
            {selectedPayment.screenshot ? (
              <img
                src={selectedPayment.screenshot.startsWith('http') ? selectedPayment.screenshot : `${BASE_URL}${selectedPayment.screenshot}`}
                alt="Payment screenshot"
                style={{
                  width: '100%', maxHeight: '400px', objectFit: 'contain',
                  borderRadius: '12px', border: '1px solid var(--border-default)',
                }}
              />
            ) : (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '40px', borderRadius: '12px', background: 'var(--bg-tertiary)',
                color: 'var(--text-tertiary)',
              }}>
                <ImageIcon size={24} style={{ marginRight: '8px' }} /> No screenshot
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModal.open}
        onClose={() => { setRejectModal({ open: false, id: null }); setRejectReason(''); }}
        title="Reject Payment"
        size="sm"
      >
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Please provide a reason for rejecting this payment.
        </p>
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="e.g., Invalid transaction ID, screenshot unclear..."
          rows={3}
          style={{
            width: '100%', padding: '12px 14px', fontSize: '13px',
            borderRadius: '10px', background: 'var(--bg-primary)',
            border: '1px solid var(--border-default)', outline: 'none',
            color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif",
            resize: 'vertical', marginBottom: '20px',
          }}
        />
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-secondary"
            onClick={() => { setRejectModal({ open: false, id: null }); setRejectReason(''); }}
          >Cancel</button>
          <button className="btn btn-danger" onClick={handleReject}>
            Reject Payment
          </button>
        </div>
      </Modal>
    </AdminLayout>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '2px' }}>
        {label}
      </div>
      <div style={{
        fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)',
        fontFamily: mono ? 'monospace' : 'inherit',
      }}>
        {value}
      </div>
    </div>
  );
}
