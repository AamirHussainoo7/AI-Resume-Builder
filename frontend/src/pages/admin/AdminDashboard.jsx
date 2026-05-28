/**
 * AdminDashboard — Analytics overview and recent activity.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Crown, IndianRupee, Clock, FileText, TrendingUp,
  ArrowRight, Shield, LayoutDashboard, CreditCard, UserSearch,
} from 'lucide-react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await adminService.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <AdminLayout><Loader text="Loading analytics..." /></AdminLayout>;

  const stats = [
    { label: 'Total Users', value: analytics?.total_users || 0, icon: Users, color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
    { label: 'Premium Users', value: analytics?.premium_users || 0, icon: Crown, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
    { label: 'Total Revenue', value: `₹${analytics?.total_revenue || 0}`, icon: IndianRupee, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
    { label: 'Pending Payments', value: analytics?.pending_payments || 0, icon: Clock, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
    { label: 'Monthly Revenue', value: `₹${analytics?.monthly_revenue || 0}`, icon: TrendingUp, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
    { label: 'Total Exports', value: analytics?.total_exports || 0, icon: FileText, color: '#06b6d4', bg: 'rgba(6,182,212,0.08)' },
  ];

  return (
    <AdminLayout active="dashboard">
      <div className="animate-fade-in-up">
        <h1 style={{
          fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)',
          letterSpacing: '-0.03em', marginBottom: '6px',
        }}>Admin Dashboard</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '28px' }}>
          Overview of platform activity and revenue
        </p>

        {/* Stats Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px', marginBottom: '32px',
        }}>
          {stats.map((s, i) => (
            <div
              key={i}
              className="animate-fade-in-up"
              style={{
                padding: '20px', borderRadius: '16px',
                background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
                animationDelay: `${i * 0.05}s`,
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: s.bg, color: s.color,
                }}>
                  <s.icon size={20} />
                </div>
              </div>
              <div style={{
                fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)',
                letterSpacing: '-0.03em', lineHeight: 1,
              }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px', marginBottom: '32px',
        }}>
          <QuickAction
            title="Payment Requests"
            subtitle={`${analytics?.pending_payments || 0} pending`}
            icon={CreditCard}
            color="#f59e0b"
            onClick={() => navigate('/admin/payments')}
          />
          <QuickAction
            title="User Management"
            subtitle={`${analytics?.total_users || 0} users`}
            icon={UserSearch}
            color="#6366f1"
            onClick={() => navigate('/admin/users')}
          />
        </div>

        {/* Recent Payments */}
        {analytics?.recent_payments?.length > 0 && (
          <div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '16px',
            }}>
              <h3 style={{
                fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}>Recent Payment Requests</h3>
              <button
                onClick={() => navigate('/admin/payments')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  fontSize: '13px', fontWeight: 600, color: '#6366f1',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                View All <ArrowRight size={14} />
              </button>
            </div>
            <div style={{
              borderRadius: '16px', overflow: 'hidden',
              border: '1px solid var(--border-default)',
            }}>
              {analytics.recent_payments.map((p, i) => (
                <div key={p.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 20px', background: 'var(--bg-secondary)',
                  borderBottom: i < analytics.recent_payments.length - 1 ? '1px solid var(--border-default)' : 'none',
                }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {p.user_email}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                      ₹{p.amount} · {p.transaction_id} · {new Date(p.submitted_at).toLocaleString()}
                    </div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

/* ---------- Admin Layout Wrapper ---------- */

export function AdminLayout({ children, active }) {
  const navigate = useNavigate();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'payments', label: 'Payments', icon: CreditCard, path: '/admin/payments' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', flexShrink: 0, padding: '24px 14px',
        background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-default)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '0 12px', marginBottom: '32px',
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          }}>
            <Shield size={18} color="white" />
          </div>
          <span style={{
            fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>Admin</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', borderRadius: '10px', fontSize: '13px',
                  fontWeight: isActive ? 600 : 500, border: 'none', cursor: 'pointer',
                  textAlign: 'left', transition: 'all 0.2s',
                  background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  color: isActive ? '#6366f1' : 'var(--text-secondary)',
                }}
              >
                <item.icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 14px', borderRadius: '10px', fontSize: '13px',
            fontWeight: 500, background: 'transparent', border: 'none',
            color: 'var(--text-tertiary)', cursor: 'pointer', textAlign: 'left',
          }}
        >
          <ArrowRight size={15} style={{ transform: 'rotate(180deg)' }} />
          Back to App
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px 36px', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}

/* ---------- Helpers ---------- */

function QuickAction({ title, subtitle, icon: Icon, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        padding: '18px 20px', borderRadius: '16px', textAlign: 'left',
        background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
        cursor: 'pointer', transition: 'all 0.2s', width: '100%',
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
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{subtitle}</div>
      </div>
      <ArrowRight size={16} style={{ marginLeft: 'auto', color: 'var(--text-tertiary)' }} />
    </button>
  );
}

export function StatusBadge({ status }) {
  const colors = {
    pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
    approved: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
    rejected: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
  };
  const c = colors[status] || colors.pending;
  return (
    <span style={{
      padding: '4px 12px', borderRadius: '20px', fontSize: '11px',
      fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
      background: c.bg, color: c.color,
    }}>
      {status}
    </span>
  );
}
