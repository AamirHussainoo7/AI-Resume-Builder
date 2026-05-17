/**
 * Profile Page — User profile management with password change.
 */

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import FormInput from '../components/common/FormInput';
import { updateProfile } from '../redux/authSlice';
import authService from '../services/authService';

export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', username: '' });
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '' });
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', username: user.username || '' });
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dispatch(updateProfile(form)).unwrap();
      toast.success('Profile updated!');
    } catch (err) { toast.error(err || 'Update failed'); }
    setSaving(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pwForm.old_password || !pwForm.new_password) { toast.error('Fill both fields'); return; }
    setPwSaving(true);
    try {
      await authService.changePassword(pwForm);
      toast.success('Password changed!');
      setPwForm({ old_password: '', new_password: '' });
    } catch (err) { toast.error(err.response?.data?.old_password?.[0] || 'Failed'); }
    setPwSaving(false);
  };

  return (
    <div className="page-container">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="content-area p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-8 animate-fade-in-up" style={{ color: 'var(--text-primary)' }}>Profile Settings</h1>

        <div className="max-w-xl space-y-6 stagger-children">
          {/* Profile Card */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary-50)', color: 'var(--primary-500)' }}>
                <User size={20} />
              </div>
              <div>
                <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Personal Info</h2>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{user?.email}</p>
              </div>
            </div>
            <form onSubmit={handleSaveProfile}>
              <FormInput label="Full Name" id="profile-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
              <FormInput label="Username" id="profile-username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="username" />
              <button type="submit" disabled={saving} className="btn btn-primary mt-2" id="save-profile">
                {saving ? <div className="spinner" style={{ width: 14, height: 14, borderTopColor: 'white' }} /> : <Save size={16} />}
                Save Changes
              </button>
            </form>
          </div>

          {/* Password Card */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--error)' }}>
                <Lock size={20} />
              </div>
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Change Password</h2>
            </div>
            <form onSubmit={handleChangePassword}>
              <FormInput label="Current Password" id="old-password" type="password" value={pwForm.old_password} onChange={(e) => setPwForm({ ...pwForm, old_password: e.target.value })} placeholder="Current password" />
              <FormInput label="New Password" id="new-password" type="password" value={pwForm.new_password} onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })} placeholder="New password (min 8 chars)" />
              <button type="submit" disabled={pwSaving} className="btn btn-secondary mt-2" id="change-password">
                {pwSaving ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <Lock size={16} />}
                Change Password
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
