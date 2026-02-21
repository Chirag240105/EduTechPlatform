import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { UserContext } from "../../Context/Context";
import {
  LayoutDashboard,
  FileText,
  Layers,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/documents", label: "Documents", icon: FileText },
  { path: "/flashcard", label: "Flashcards", icon: Layers },
  { path: "/quizzes", label: "Quizzes", icon: HelpCircle },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = React.useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (sidebarOpen && sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { x: -280, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }
    if (sidebarOpen && overlayRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 }
      );
    }
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--color-bg)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-[280px] flex-shrink-0
          bg-[var(--color-surface)] border-r border-[var(--color-border)]
          transform transition-transform duration-300 ease-out
          md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-[13px] flex items-center justify-between border-b border-[var(--color-border)]">
            <Link to="/dashboard" className="font-semibold text-[20px] text-[var(--color-text)]">
              EduPlatform
            </Link>
            <button
              type="button"
              className="md:hidden p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item, i) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)]
                    text-sm font-medium transition-colors
                    ${isActive
                      ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
                      : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-[var(--color-border)]">
            <div className="px-3 py-2 text-[16px] text-[var(--color-text-muted)] truncate">
              {user?.name}
            </div>
            <div className="px-3 py-2 text-[16px] text-[var(--color-text-muted)] truncate">
              {user?.email}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-error)] transition-colors text-sm"
            >
              <LogOut className="w-5 h-5" />
              Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 h-14 px-4 bg-[var(--color-bg)]/80 backdrop-blur border-b border-[var(--color-border)]">
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-muted)]"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm text-[var(--color-text-muted)] truncate">
            {location.pathname === "/dashboard" && "Dashboard"}
            {location.pathname === "/documents" && "Documents"}
            {location.pathname.startsWith("/document/") && "Document"}
            {location.pathname === "/flashcard" && "Flashcards"}
            {location.pathname.startsWith("/flashcard/") && "Study"}
            {location.pathname === "/quizzes" && "Quizzes"}
            {location.pathname.startsWith("/quiz/") && "Quiz"}
          </span>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
