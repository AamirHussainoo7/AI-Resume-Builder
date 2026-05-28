/**
 * UserManagement — Admin page to search users, view status, and extend subscriptions.
 */

import { useState, useEffect } from 'react';
import {
  Search, Crown, User, Calendar, Loader2, ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import { AdminLayout, StatusBadge } from './AdminDashboard';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [extendModal, setExtendModal] = useState({ open: false, user: null });
  const [extendDays, setExtendDays] = useState(30);
  const [extendLoading, setExtendLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [search, filter]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filter) params.filter = filter;
      const data = await adminService.getUsers(params);
      setUsers(data.results || data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtend = async () => {
    if (!extendModal.user) return;
    setExtendLoading(true);
    try {
      await adminService.extendSubscription(extendModal.user.id, extendDays);
      toast.success(`Subscription extended by ${extendDays} days`);
      setExtendModal({ open: false, user: null });
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Extension failed');
    } finally {
      setExtendLoading(false);
    }
  };

  return (
    <AdminLayout active="users">
      <div className="animate-fade-in-up">
        <h1 style={{
          fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)',
          letterSpacing: '-0.03em', marginBottom: '6px',
        }}>User Management</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Search and manage user subscriptions
        </p>

        {/* Filters */}
        <div style={{
          display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap',
        }}>
          <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '360px' }}>
            <Search size={15} style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-tertiary)',
            }} />
            <input
              type="text"
              placeholder="Search by email, name, or username..."
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

          <div style={{ position: 'relative' }}>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: '10px 36px 10px 14px', fontSize: '13px', fontWeight: 500,
                borderRadius: '10px', background: 'var(--bg-secondary)',
                border: '1px solid var(--border-default)', outline: 'none',
                color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif",
                cursor: 'pointer', appearance: 'none',
              }}
            >
              <option value="">All Users</option>
              <option value="premium">Premium</option>
              <option value="free">Free</option>
            </select>
            <ChevronDown size={14} style={{
              position: 'absolute', right: '12px', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-tertiary)',
              pointerEvents: 'none',
            }} />
          </div>
        </div>

        {/* Users List */}
        {isLoading ? (
          <Loader text="Loading users..." />
        ) : users.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            color: 'var(--text-tertiary)', fontSize: '14px',
          }}>
            <User size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p>No users found</p>
          </div>
        ) : (
          <div style={{
            borderRadius: '16px', overflow: 'hidden',
            border: '1px solid var(--border-default)',
          }}>
            {/* Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr',
              gap: '12px', padding: '12px 20px', background: 'var(--bg-tertiary)',
              fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)',
              textTransform: 'uppercase', letterSpacing: '1px',
            }}>
              <span>User</span>
              <span>Plan</span>
              <span>Subscription</span>
              <span>Actions</span>
            </div>

            {/* Rows */}
            {users.map((u) => (
              <div key={u.id} style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr',
                gap: '12px', padding: '14px 20px', alignItems: 'center',
                background: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border-default)',
              }}>
                <div>
                  <div style={{
                    fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    {u.name || u.username}
                    {u.is_premium && <Crown size={13} style={{ color: '#f59e0b' }} />}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    {u.email} {u.phone ? `· ${u.phone}` : ''}
                  </div>
                </div>
                <div>
                  <span style={{
                    padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
                    fontWeight: 700, textTransform: 'uppercase',
                    background: u.is_premium ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-tertiary)',
                    color: u.is_premium ? '#f59e0b' : 'var(--text-tertiary)',
                  }}>
                    {u.is_premium ? 'Premium' : 'Free'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {u.premium_end_date ? (
                    <>
                      Expires {new Date(u.premium_end_date).toLocaleDateString()}
                    </>
                  ) : '—'}
                </div>
                <div>
                  <button
                    onClick={() => { setExtendModal({ open: true, user: u }); setExtendDays(30); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      padding: '6px 12px', borderRadius: '8px', fontSize: '11px',
                      fontWeight: 600, background: 'rgba(99, 102, 241, 0.08)',
                      border: '1px solid rgba(99, 102, 241, 0.15)', cursor: 'pointer',
                      color: '#6366f1',
                    }}
                  >
                    <Calendar size={13} /> Extend
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Extend Subscription Modal */}
      <Modal
        isOpen={extendModal.open}
        onClose={() => setExtendModal({ open: false, user: null })}
        title="Extend Subscription"
        size="sm"
      >
        {extendModal.user && (
          <div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Extend premium subscription for <strong>{extendModal.user.email}</strong>
            </p>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block', fontSize: '13px', fontWeight: 600,
                color: 'var(--text-secondary)', marginBottom: '6px',
              }}>Number of Days</label>
              <input
                type="number"
                value={extendDays}
                onChange={(e) => setExtendDays(e.target.value)}
                min={1}
                max={365}
                style={{
                  width: '100%', padding: '10px 14px', fontSize: '14px',
                  borderRadius: '10px', background: 'var(--bg-primary)',
                  border: '1px solid var(--border-default)', outline: 'none',
                  color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif",
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setExtendModal({ open: false, user: null })}
              >Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleExtend}
                disabled={extendLoading}
                style={{ gap: '6px' }}
              >
                {extendLoading ? <Loader2 size={14} className="animate-spin" /> : null}
                Extend by {extendDays} days
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
