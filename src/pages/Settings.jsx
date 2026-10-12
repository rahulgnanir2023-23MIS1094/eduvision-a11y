import { useState } from 'react';
import {
  User,
  Bell,
  Lock,
  Globe,
  Sliders,
  CheckCircle2,
  Save,
  GraduationCap,
} from 'lucide-react';
import { userProfile } from '../data/mockData';
import { useAccessibility } from '../context/AccessibilityContext';

export default function Settings() {
  const { isHighContrast, announce } = useAccessibility();
  const [profileName, setProfileName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [captionsDefault, setCaptionsDefault] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    announce('Account preferences successfully saved.');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div>
        <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
          Account &amp; System Preferences
        </h2>
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Manage your student profile, accessibility defaults, and notifications
        </p>
      </div>

      {savedSuccess && (
        <div
          className="p-4 rounded-2xl flex items-center gap-3 a11y-transition"
          style={{
            backgroundColor: 'rgba(22, 163, 74, 0.15)',
            border: '2px solid var(--success)',
            color: 'var(--success)',
          }}
          role="alert"
        >
          <CheckCircle2 size={20} aria-hidden="true" />
          <span className="text-sm font-bold">Preferences saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div
          className="rounded-2xl p-6 a11y-transition shadow-sm space-y-4"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div className="flex items-center gap-3 pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <User size={20} style={{ color: 'var(--accent)' }} aria-hidden="true" />
            <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              Learner Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Full Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full p-2.5 rounded-xl text-sm border font-medium"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Registered Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl text-sm border font-medium"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Learning Defaults Card */}
        <div
          className="rounded-2xl p-6 a11y-transition shadow-sm space-y-4"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div className="flex items-center gap-3 pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <Sliders size={20} style={{ color: 'var(--accent)' }} aria-hidden="true" />
            <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              Assistive Learning Defaults
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={captionsDefault}
                onChange={(e) => setCaptionsDefault(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Always auto-scroll transcripts in lesson player
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEmail}
                onChange={(e) => setNotificationsEmail(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Receive audio cue notification alerts for new assignments
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-sm"
          style={{
            backgroundColor: 'var(--accent)',
            color: '#ffffff',
          }}
        >
          <Save size={16} aria-hidden="true" />
          Save Preferences
        </button>
      </form>
    </div>
  );
}

