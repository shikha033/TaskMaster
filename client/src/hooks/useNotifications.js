import { useEffect, useMemo, useRef, useState } from "react";

const DUE_SOON_HOURS = 24;

// Returns tasks that are pending and due within the next 24 hours (or overdue).
function getDueSoon(tasks) {
  const now = Date.now();
  const windowMs = DUE_SOON_HOURS * 60 * 60 * 1000;
  return tasks.filter((t) => {
    if (t.status === "Completed" || !t.due_date) return false;
    const due = new Date(t.due_date).getTime();
    return due - now <= windowMs; // due soon or overdue
  });
}

export function useNotifications(tasks) {
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const notifiedRef = useRef(new Set());

  const dueSoon = useMemo(() => getDueSoon(tasks), [tasks]);

  const requestPermission = async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  // Fire a browser notification once per task when permission is granted.
  useEffect(() => {
    if (permission !== "granted" || typeof Notification === "undefined") return;
    dueSoon.forEach((task) => {
      if (!notifiedRef.current.has(task.id)) {
        notifiedRef.current.add(task.id);
        new Notification("TaskMaster reminder", {
          body: `"${task.title}" is due soon.`,
        });
      }
    });
  }, [dueSoon, permission]);

  return { dueSoon, permission, requestPermission };
}
