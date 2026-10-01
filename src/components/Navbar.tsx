import { Link, useLocation } from "react-router-dom";
import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

function useBreadcrumb(): string {
  const { pathname } = useLocation();
  if (pathname.includes("/chapters") && pathname.endsWith("/add")) return "Add Chapter";
  if (pathname.includes("/questions") && pathname.endsWith("/add")) return "Add Question";
  if (pathname === "/subjects/add") return "Add Subject";
  if (pathname.includes("/chapters")) return "Chapters";
  if (pathname.includes("/questions")) return "Questions";
  if (pathname.startsWith("/subjects")) return "Subjects";
  return "Dashboard";
}

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { admin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const breadcrumb = useBreadcrumb();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-panel/90 px-4 py-3 backdrop-blur dark:border-border-dark dark:bg-panel-dark/90 md:px-6">
      <div className="flex items-center gap-3">
        <button
          className="rounded-card p-1.5 text-ink hover:bg-black/5 dark:text-white dark:hover:bg-white/10 md:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/subjects" className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3 12h4l2-6 4 12 2-6h6"
              stroke="#DE4363"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-display text-base font-semibold text-ink dark:text-white">Nursify</span>
        </Link>
        <span className="hidden text-ink-light/40 dark:text-white/30 sm:inline">/</span>
        <span className="hidden text-sm text-ink-light dark:text-white/60 sm:inline">{breadcrumb}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="rounded-card p-2 text-ink-light hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
        <div className="hidden items-center gap-2 border-l border-border pl-3 dark:border-border-dark sm:flex">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-clinical-100 text-xs font-semibold text-clinical-700 dark:bg-clinical-800 dark:text-clinical-200">
            {(admin?.username ?? "A").charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-ink dark:text-white/80">{admin?.username ?? "Admin"}</span>
        </div>
        <button
          onClick={logout}
          aria-label="Log out"
          className="flex items-center gap-1.5 rounded-card px-2.5 py-1.5 text-sm text-ink-light hover:bg-black/5 hover:text-pulse-500 dark:text-white/60 dark:hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
}
