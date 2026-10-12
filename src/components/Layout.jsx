import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ReadingGuide from './ReadingGuide';
import KeyboardShortcuts from './KeyboardShortcuts';
import AccessibilityFAB from './AccessibilityFAB';

export default function Layout() {
  return (
    <div className="min-h-screen a11y-transition" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* BIS IS 17802 / WCAG 2.1 § 2.4.1 Skip Navigation Link */}
      <a href="#main-content" className="skip-link">
        Skip directly to main learning content
      </a>

      {/* Global Assistive Utilities */}
      <ReadingGuide />
      <KeyboardShortcuts />
      <AccessibilityFAB />

      {/* Shell */}
      <Sidebar />
      <Header />

      {/* Main Content Viewport */}
      <main
        id="main-content"
        className="ml-64 pt-16 min-h-screen"
        role="main"
        aria-label="EduVision Learning Workspace"
        tabIndex={-1}
      >
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
