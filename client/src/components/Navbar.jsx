import { useTheme } from "../context/ThemeContext.jsx";
import { Icon } from "./Icons.jsx";
import NotificationBell from "./NotificationBell.jsx";

export default function Navbar({ user, onLogout, notifications }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="brand">
          <span className="brand-mark">
            <Icon name="check" size={18} />
          </span>
          <span className="brand-name">TaskMaster</span>
        </div>

        <div className="nav-actions">
          <NotificationBell
            dueSoon={notifications.dueSoon}
            permission={notifications.permission}
            requestPermission={notifications.requestPermission}
          />

          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <Icon name={theme === "light" ? "moon" : "sun"} />
          </button>

          <div className="user-chip">
            <span className="user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </span>
            <span className="user-meta">
              <span className="user-name">{user.username}</span>
              <span className="user-email">{user.email}</span>
            </span>
          </div>

          <button className="btn btn-ghost logout-btn" onClick={onLogout}>
            <Icon name="logout" size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
