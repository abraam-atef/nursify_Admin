import { NavLink } from "react-router-dom";
import { BookOpen, HelpCircle, LayoutGrid, X } from "lucide-react";

const NAV_ITEMS = [
  { to: "/subjects", label: "Subjects", icon: LayoutGrid },
  { to: "/subjects", label: "Chapters", icon: BookOpen },
  { to: "/subjects", label: "Questions", icon: HelpCircle },
];

interface SidebarProps {
  isDrawerOpen: boolean;
  onCloseDrawer: () => void;
}

/**
 * Chapters and Questions are only reachable once a Subject (and then a
 * Chapter) has been picked, since their routes carry an id in the path.
 * The sidebar always links back to Subjects as the entry point, and the
 * current section is highlighted from the active route below.
 */
export function Sidebar({ isDrawerOpen, onCloseDrawer }: SidebarProps) {
  const content = (
    <nav className="flex h-full flex-col gap-1 p-4">
      <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-ink-light/70 dark:text-white/40">
        Content
      </p>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          onClick={onCloseDrawer}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-card px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-clinical-50 text-clinical-700 dark:bg-clinical-900/50 dark:text-clinical-200"
                : "text-ink-light hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/5"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-pulse-400" : "bg-transparent"}`}
                aria-hidden="true"
              />
              <item.icon className="h-4 w-4" />
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop / tablet: static column */}
      <aside className="hidden w-56 shrink-0 border-r border-border dark:border-border-dark md:block">
        {content}
      </aside>

      {/* Mobile: drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={onCloseDrawer} aria-hidden="true" />
          <div className="relative z-10 h-full w-64 bg-surface shadow-soft dark:bg-surface-dark">
            <div className="flex items-center justify-between border-b border-border p-4 dark:border-border-dark">
              <span className="font-display text-sm font-semibold">Menu</span>
              <button onClick={onCloseDrawer} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
