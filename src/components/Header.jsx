import { useState, useRef, useEffect } from 'react';
import { Bell, User, X } from 'lucide-react';
import { notifications, userProfile } from '../data/mockData';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const panelRef = useRef(null);
  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className="fixed top-0 left-64 right-0 h-16 flex items-center justify-between px-6 z-20 a11y-transition"
      style={{
        backgroundColor: 'var(--header-bg)',
        borderBottom: '1px solid var(--header-border)',
      }}
      role="banner"
    >
      <div>
        <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Welcome back, {userProfile.name}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Continue your learning journey
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg transition-colors duration-200"
            style={{ color: 'var(--text-secondary)' }}
            aria-label={`Notifications, ${unreadCount} unread`}
            aria-expanded={showNotifications}
            aria-haspopup="true"
          >
            <Bell size={22} aria-hidden="true" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ backgroundColor: 'var(--danger)', color: '#ffffff' }}
                aria-hidden="true"
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 top-12 w-80 rounded-xl shadow-xl overflow-hidden a11y-transition"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
              }}
              role="dialog"
              aria-label="Notifications panel"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Notifications</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label="Close notifications"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
              <ul className="max-h-64 overflow-y-auto" role="list">
                {notifications.map(n => (
                  <li
                    key={n.id}
                    className="px-4 py-3 border-b last:border-b-0 transition-colors duration-200"
                    style={{
                      borderColor: 'var(--border-color)',
                      backgroundColor: n.unread ? 'var(--accent-light)' : 'transparent',
                    }}
                  >
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{n.text}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{n.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent)', color: '#ffffff' }}
            aria-hidden="true"
          >
            <User size={18} />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{userProfile.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{userProfile.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
