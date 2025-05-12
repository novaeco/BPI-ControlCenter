import React, { useState, useRef } from 'react';
import { X, Save, UserCircle2, Mail, Lock, Shield, Bell, Trash2, LogOut, Upload } from 'lucide-react';

interface AccountSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'user';
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  twoFactorEnabled: boolean;
  language: string;
  timezone: string;
  avatarUrl: string | null;
}

interface AccountSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAvatarUpdate?: (url: string) => void;
}

const AccountSettingsPopup: React.FC<AccountSettingsPopupProps> = ({ isOpen, onClose, onAvatarUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState<AccountSettings>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    role: 'admin',
    notificationsEnabled: true,
    emailNotifications: true,
    pushNotifications: true,
    twoFactorEnabled: false,
    language: 'en',
    timezone: 'UTC',
    avatarUrl: null
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleChange = (field: keyof AccountSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving account settings:', settings);
    onClose();
  };

  const handlePasswordChange = () => {
    if (newPassword === confirmPassword) {
      console.log('Changing password');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleChange('avatarUrl', result);
        onAvatarUpdate?.(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1c2936] w-full max-w-4xl rounded-lg shadow-xl border border-gray-700 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <UserCircle2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">Account Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <UserCircle2 className="w-4 h-4 text-cyan-400" />
                  Profile Picture
                </h3>
                <div className="flex flex-col items-center gap-4">
                  <div 
                    className="w-24 h-24 rounded-full bg-cyan-400/20 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-cyan-400/30 transition-colors"
                    onClick={handleAvatarClick}
                  >
                    {settings.avatarUrl ? (
                      <img src={settings.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle2 className="w-16 h-16 text-cyan-400" />
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    onClick={handleAvatarClick}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-400 transition-colors text-sm"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </button>
                </div>
              </div>

              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <UserCircle2 className="w-4 h-4 text-cyan-400" />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={settings.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={settings.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={settings.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  Change Password
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <button
                    onClick={handlePasswordChange}
                    className="w-full bg-cyan-500 text-white py-2 rounded-md hover:bg-cyan-400 transition-colors text-sm"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  Security Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Two-Factor Authentication</span>
                    <button
                      onClick={() => handleChange('twoFactorEnabled', !settings.twoFactorEnabled)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        settings.twoFactorEnabled ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          settings.twoFactorEnabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Account Role
                    </label>
                    <select
                      value={settings.role}
                      onChange={(e) => handleChange('role', e.target.value as AccountSettings['role'])}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                      disabled
                    >
                      <option value="admin">Administrator</option>
                      <option value="manager">Manager</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  Notification Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Enable Notifications</span>
                    <button
                      onClick={() => handleChange('notificationsEnabled', !settings.notificationsEnabled)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        settings.notificationsEnabled ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          settings.notificationsEnabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Email Notifications</span>
                    <button
                      onClick={() => handleChange('emailNotifications', !settings.emailNotifications)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        settings.emailNotifications ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                      disabled={!settings.notificationsEnabled}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          settings.emailNotifications ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Push Notifications</span>
                    <button
                      onClick={() => handleChange('pushNotifications', !settings.pushNotifications)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        settings.pushNotifications ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                      disabled={!settings.notificationsEnabled}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          settings.pushNotifications ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  Preferences
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleChange('language', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Timezone
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleChange('timezone', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="CST">Central Time</option>
                      <option value="PST">Pacific Time</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="border-t border-gray-700 pt-4">
              <button
                onClick={handleDeleteAccount}
                className="w-full bg-red-500/20 text-red-400 py-2 rounded-md hover:bg-red-500/30 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-between gap-3">
          <button
            className="px-4 py-2 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-md bg-cyan-500 text-white hover:bg-cyan-400 transition-colors text-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPopup;