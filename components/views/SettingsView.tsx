import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Settings,
  Building,
  Mail,
  Shield,
  Save,
  CheckCircle2,
  Globe,
  MapPin,
  Bell,
  Lock,
  KeyRound,
  User,
  Users,
  ShieldAlert,
  RotateCcw,
  Smartphone,
  LogOut,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { M3Card } from '../ui/M3Card';
import { M3Button } from '../ui/M3Button';
import { M3Badge } from '../ui/M3Badge';
import { M3ConfirmDialog } from '../ui/M3ConfirmDialog';
import { CompanyProfile } from '@/lib/mock-data';

export interface SettingsViewProps {
  company: CompanyProfile;
  onUpdateCompany: (updated: Partial<CompanyProfile>) => void;
}

interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Disabled';
  mfaEnabled: boolean;
  lastLogin: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  company,
  onUpdateCompany,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'users'>('profile');

  // Company Profile state
  const [name, setName] = useState(company.name || 'Apex Digital Systems');
  const [clientName, setClientName] = useState(company.clientName || 'Julian Vance');
  const [email, setEmail] = useState(company.clientEmail || 'julian.vance@apexdigital.com');
  const [phone, setPhone] = useState('+1 (415) 892-3091');
  const [address, setAddress] = useState(
    company.billingAddress || '550 Howard Street, Suite 800, San Francisco, CA 94105'
  );
  const [taxId, setTaxId] = useState(company.taxId || 'US-948201948');
  const [industry, setIndustry] = useState(company.industry || 'Enterprise Software & Cloud AI');

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password Update state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  // Team & Client Access Reset state
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>([
    {
      id: 'u-1',
      name: company.clientName || 'Julian Vance',
      email: company.clientEmail || 'julian.vance@apexdigital.com',
      role: 'Client Executive',
      status: 'Active',
      mfaEnabled: true,
      lastLogin: '2 mins ago',
    },
    {
      id: 'u-2',
      name: 'Elena Rostova',
      email: 'elena.rostova@operava.io',
      role: 'Admin Lead',
      status: 'Active',
      mfaEnabled: true,
      lastLogin: '10 mins ago',
    },
    {
      id: 'u-3',
      name: 'Marcus Brody',
      email: 'marcus.brody@operava.io',
      role: 'DevOps Engineer',
      status: 'Active',
      mfaEnabled: true,
      lastLogin: '1 hour ago',
    },
    {
      id: 'u-4',
      name: 'Sarah Chen',
      email: 'sarah.chen@operava.io',
      role: 'Support Lead',
      status: 'Active',
      mfaEnabled: false,
      lastLogin: 'Yesterday',
    },
    {
      id: 'u-5',
      name: 'David Miller',
      email: 'david.miller@apexdigital.com',
      role: 'Client Billing Admin',
      status: 'Active',
      mfaEnabled: false,
      lastLogin: '3 days ago',
    },
  ]);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    variant?: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompany({
      name,
      clientName,
      clientEmail: email,
      billingAddress: address,
      taxId,
      industry,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePasswordUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match. Please verify typing.');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Confirm Password Change',
      message: 'Are you sure you want to change your account password? Active sessions will remain authenticated.',
      confirmText: 'Update Password',
      variant: 'primary',
      onConfirm: () => {
        setPasswordSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(false), 4000);
      },
    });
  };

  const handleResetUserPassword = (user: TeamUser) => {
    setConfirmModal({
      isOpen: true,
      title: `Reset Password for ${user.name}?`,
      message: `Do you want to send a secure password reset link to ${user.email}? Their current password will be invalidated immediately.`,
      confirmText: 'Send Reset Link',
      variant: 'warning',
      onConfirm: () => {
        alert(`Secure password reset link dispatched to ${user.email}!`);
      },
    });
  };

  const handleToggleUserStatus = (user: TeamUser) => {
    const nextStatus = user.status === 'Active' ? 'Disabled' : 'Active';
    setConfirmModal({
      isOpen: true,
      title: `${nextStatus === 'Disabled' ? 'Disable' : 'Enable'} Access for ${user.name}?`,
      message: `Do you want to set account access for ${user.email} to [${nextStatus}]?`,
      confirmText: `Confirm ${nextStatus}`,
      variant: nextStatus === 'Disabled' ? 'danger' : 'primary',
      onConfirm: () => {
        setTeamUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
        );
      },
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--m3-on-surface)] flex items-center gap-2">
          <Settings className="w-6 h-6 text-[var(--m3-primary)]" />
          Portal Settings, Security & Authentication
        </h1>
        <p className="text-xs text-[var(--m3-on-surface-variant)]">
          Manage corporate billing identities, update personal passwords, 2FA security, and manage user access reset rules.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)]">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeTab === 'profile'
              ? 'bg-[var(--m3-primary)] text-[var(--m3-on-primary)] shadow-2xs'
              : 'hover:bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface-variant)]'
          }`}
        >
          Company & Executive Profile
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeTab === 'security'
              ? 'bg-[var(--m3-primary)] text-[var(--m3-on-primary)] shadow-2xs'
              : 'hover:bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface-variant)]'
          }`}
        >
          Password & 2FA Security
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeTab === 'users'
              ? 'bg-[var(--m3-primary)] text-[var(--m3-on-primary)] shadow-2xs'
              : 'hover:bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface-variant)]'
          }`}
        >
          User Accounts & Password Resets
        </button>
      </div>

      {/* Tab 1: Profile & Company Settings */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {savedSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-[var(--m3-success-container)] text-[var(--m3-on-success-container)] flex items-center gap-3 text-xs font-semibold"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Client Profile & Corporate Billing Details Updated Successfully!</span>
            </motion.div>
          )}

          <M3Card variant="filled" className="p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--m3-outline-variant)] pb-3">
              <Building className="w-5 h-5 text-[var(--m3-primary)]" />
              <h2 className="text-base font-bold text-[var(--m3-on-surface)]">
                Company Identity & Tax Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Company Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] text-[var(--m3-on-surface)] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Primary Executive Contact</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] text-[var(--m3-on-surface)] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Tax EIN / VAT Identification</label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] text-[var(--m3-on-surface)] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Industry Sector</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] text-[var(--m3-on-surface)] focus:outline-hidden"
                />
              </div>
            </div>
          </M3Card>

          <M3Card variant="filled" className="p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--m3-outline-variant)] pb-3">
              <Mail className="w-5 h-5 text-[var(--m3-primary)]" />
              <h2 className="text-base font-bold text-[var(--m3-on-surface)]">
                Billing Contacts & Location
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Billing Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] text-[var(--m3-on-surface)] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] text-[var(--m3-on-surface)] focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">Corporate Billing Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] text-[var(--m3-on-surface)] focus:outline-hidden"
                />
              </div>
            </div>
          </M3Card>

          <div className="flex justify-end pt-2">
            <M3Button variant="filled" size="lg" type="submit" icon={<Save className="w-5 h-5" />}>
              Save Profile Changes
            </M3Button>
          </div>
        </form>
      )}

      {/* Tab 2: Password & Authentication Security */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {passwordSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-[var(--m3-success-container)] text-[var(--m3-on-success-container)] flex items-center gap-3 text-xs font-semibold"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Password updated successfully! An email alert was dispatched.</span>
            </motion.div>
          )}

          {passwordError && (
            <div className="p-4 rounded-2xl bg-[var(--m3-error-container)] text-[var(--m3-on-error-container)] flex items-center gap-3 text-xs font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          {/* Password Update Form */}
          <M3Card variant="filled" className="p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--m3-outline-variant)] pb-3">
              <KeyRound className="w-5 h-5 text-[var(--m3-primary)]" />
              <h2 className="text-base font-bold text-[var(--m3-on-surface)]">
                Update Security Password
              </h2>
            </div>

            <form onSubmit={handlePasswordUpdateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Current Password *</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] text-[var(--m3-on-surface)] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">New Password *</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 chars"
                    className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] text-[var(--m3-on-surface)] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full p-3 rounded-2xl bg-[var(--m3-surface-container)] text-[var(--m3-on-surface)] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[var(--m3-on-surface-variant)]">
                  Must contain uppercase, lowercase, special symbols & minimum 8 characters.
                </span>
                <M3Button variant="filled" type="submit">
                  Update Password
                </M3Button>
              </div>
            </form>
          </M3Card>

          {/* Two-Factor Authentication */}
          <M3Card variant="filled" className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--m3-outline-variant)] pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[var(--m3-primary)]" />
                <h2 className="text-base font-bold text-[var(--m3-on-surface)]">
                  Two-Factor Multi-Factor Authentication (2FA)
                </h2>
              </div>
              <M3Badge variant={is2FAEnabled ? 'success' : 'outline'}>
                {is2FAEnabled ? '2FA Active' : '2FA Disabled'}
              </M3Badge>
            </div>

            <div className="flex items-center justify-between text-xs p-4 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)]">
              <div>
                <p className="font-bold text-[var(--m3-on-surface)]">
                  Google Authenticator / YubiKey WebAuthn
                </p>
                <p className="text-[11px] text-[var(--m3-on-surface-variant)] mt-0.5">
                  Requires TOTP 6-digit code or hardware security token upon executive portal sign-in.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setConfirmModal({
                    isOpen: true,
                    title: is2FAEnabled ? 'Disable 2FA Authentication?' : 'Enable 2FA Authentication?',
                    message: is2FAEnabled
                      ? 'Disabling 2FA will lower account security level. Are you sure?'
                      : 'Enable 2FA to enforce TOTP verification codes on executive logins?',
                    confirmText: is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA',
                    variant: is2FAEnabled ? 'danger' : 'primary',
                    onConfirm: () => setIs2FAEnabled(!is2FAEnabled),
                  });
                }}
                className={`px-4 py-2 rounded-xl font-bold cursor-pointer transition-all text-xs ${
                  is2FAEnabled
                    ? 'bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface)] hover:bg-[var(--m3-surface-container-highest)]'
                    : 'bg-[var(--m3-primary)] text-[var(--m3-on-primary)]'
                }`}
              >
                {is2FAEnabled ? 'Configure / Turn Off' : 'Enable 2FA'}
              </button>
            </div>
          </M3Card>
        </div>
      )}

      {/* Tab 3: User Accounts & Password Resets for All */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)]">
            <div>
              <h2 className="font-bold text-base text-[var(--m3-on-surface)] flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--m3-primary)]" />
                Team & Client User Account Password Reset Engine
              </h2>
              <p className="text-xs text-[var(--m3-on-surface-variant)]">
                Reset passwords, toggle account authorization states, and manage active executive sessions.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--m3-outline-variant)] bg-[var(--m3-surface-container)] text-[var(--m3-on-surface-variant)] uppercase font-semibold text-[10px]">
                    <th className="p-4">User Name</th>
                    <th className="p-4">Role & Email</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">2FA</th>
                    <th className="p-4">Last Login</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--m3-outline-variant)] text-[var(--m3-on-surface)]">
                  {teamUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[var(--m3-surface-container)] transition-colors">
                      <td className="p-4 font-bold text-xs">{user.name}</td>
                      <td className="p-4">
                        <div className="font-semibold text-xs">{user.email}</div>
                        <div className="text-[10px] text-[var(--m3-on-surface-variant)]">{user.role}</div>
                      </td>
                      <td className="p-4">
                        <M3Badge variant={user.status === 'Active' ? 'success' : 'error'}>
                          {user.status}
                        </M3Badge>
                      </td>
                      <td className="p-4">
                        <M3Badge variant={user.mfaEnabled ? 'outline' : 'warning'} size="sm">
                          {user.mfaEnabled ? '2FA On' : 'No 2FA'}
                        </M3Badge>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-[var(--m3-on-surface-variant)]">
                        {user.lastLogin}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <M3Button
                            variant="tonal"
                            size="sm"
                            onClick={() => handleResetUserPassword(user)}
                            icon={<RotateCcw className="w-3.5 h-3.5" />}
                          >
                            Reset Pass
                          </M3Button>
                          <M3Button
                            variant="text"
                            size="sm"
                            onClick={() => handleToggleUserStatus(user)}
                          >
                            {user.status === 'Active' ? 'Disable' : 'Enable'}
                          </M3Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <M3ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        variant={confirmModal.variant}
      />
    </div>
  );
};
