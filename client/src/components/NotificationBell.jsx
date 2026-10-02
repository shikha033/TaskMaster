import { useState } from "react";
import { Icon } from "./Icons.jsx";
import { formatDue } from "../lib/format.js";

export default function NotificationBell({ dueSoon, permission, requestPermission }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="notif">
      <button
        className="icon-btn notif-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
      >
        <Icon name="bell" />
        {dueSoon.length > 0 && <span className="notif-badge">{dueSoon.length}</span>}
      </button>

      {open && (
        <>
          <div className="notif-overlay" onClick={() => setOpen(false)} />
          <div className="notif-panel">
            <div className="notif-head">
              <strong>Reminders</strong>
              {permission !== "granted" && (
                <button className="link-btn" onClick={requestPermission}>
                  Enable browser alerts
                </button>
              )}
            </div>

            {dueSoon.length === 0 ? (
              <p className="notif-empty">You're all caught up. No tasks due soon.</p>
            ) : (
              <ul className="notif-list">
                {dueSoon.map((t) => (
                  <li key={t.id}>
                    <span className="notif-title">{t.title}</span>
                    <span className="notif-due">
                      <Icon name="clock" size={14} /> {formatDue(t.due_date)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
