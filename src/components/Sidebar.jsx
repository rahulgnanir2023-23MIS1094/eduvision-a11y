import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  GraduationCap,
  Shield,
  HelpCircle,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/courses', icon: BookOpen, label: 'My Courses' },
  { to: '/quiz/1', icon: HelpCircle, label: 'Quizzes & Tests' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics & Audit' },
];

export default function Sidebar() {
  const { isHighContrast, complianceScore } = useAccessibility();

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-64 flex flex-col z-30 a11y-transition shadow-sm"
      style={{
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Brand Header */}
      <div
        className="flex items-center gap-3 px-6 h-16 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
          style={{
            background: isHighContrast
              ? '#ffff00'
              : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          }}
        >
          <GraduationCap
            size={22}
            color={isHighContrast ? '#000000' : '#ffffff'}
            aria-hidden="true"
          />
        </div>
        <div>
          <span
            className="text-lg font-black tracking-tight block"
            style={{ color: isHighContrast ? '#ffff00' : '#ffffff' }}
          >
            EduVision
          </span>
          <span className="text-[10px] font-bold tracking-wider uppercase opacity-70 block text-slate-300">
            BIS IS 17802 Certified
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1.5" aria-label="Primary Navigation">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive ? 'shadow-sm' : ''
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--sidebar-active)' : 'transparent',
              color: isActive ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)',
              border: isActive && isHighContrast ? '2px solid #ffff00' : '2px solid transparent',
            })}
            aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Prominent Highlighted BIS IS 17802 Button */}
      <div className="px-3 pb-3">
        <NavLink
          to="/accessibility"
          className="flex flex-col gap-2 p-3.5 rounded-2xl text-xs font-bold transition-all duration-200 shadow-md"
          style={({ isActive }) => ({
            background: isActive
              ? isHighContrast ? '#ffff00' : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)'
              : isHighContrast ? '#111111' : 'rgba(99, 102, 241, 0.12)',
            color: isActive
              ? isHighContrast ? '#000000' : '#ffffff'
              : isHighContrast ? '#ffff00' : '#a5b4fc',
            border: `2px solid ${isHighContrast ? '#ffff00' : 'rgba(99, 102, 241, 0.4)'}`,
          })}
          aria-label="BIS IS 17802 Accessibility Engine Settings"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={18} aria-hidden="true" />
              <span className="font-black text-sm">BIS IS 17802</span>
            </div>
            <span
              className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: isHighContrast ? '#ffff00' : 'rgba(255, 255, 255, 0.2)',
                color: isHighContrast ? '#000000' : '#ffffff',
              }}
            >
              {complianceScore}%
            </span>
          </div>
          <span className="text-[11px] font-semibold opacity-90">
            Interactive Accessibility Engine
          </span>
        </NavLink>
      </div>

      {/* Settings Footer */}
      <div
        className="px-3 pb-4 pt-3 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors"
          style={{ color: 'var(--sidebar-text)' }}
        >
          <Settings size={18} aria-hidden="true" />
          <span>System Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}
