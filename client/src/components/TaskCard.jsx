import { Icon } from "./Icons.jsx";
import { formatDue, isOverdue } from "../lib/format.js";

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const done = task.status === "Completed";
  const overdue = !done && isOverdue(task.due_date);

  return (
    <div className={`task-card priority-${task.priority.toLowerCase()} ${done ? "task-done" : ""}`}>
      <button
        className={`task-check ${done ? "checked" : ""}`}
        onClick={() => onToggle(task)}
        aria-label={done ? "Mark as pending" : "Mark as completed"}
      >
        {done && <Icon name="check" size={14} />}
      </button>

      <div className="task-main">
        <div className="task-top">
          <h4 className="task-title">{task.title}</h4>
          <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
        </div>

        {task.description && <p className="task-desc">{task.description}</p>}

        <div className="task-meta">
          <span className="chip">{task.category}</span>
          <span className={`chip status-${done ? "completed" : "pending"}`}>
            {task.status}
          </span>
          {task.due_date && (
            <span className={`chip due ${overdue ? "chip-overdue" : ""}`}>
              <Icon name="calendar" size={13} /> {formatDue(task.due_date)}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button className="icon-btn sm" onClick={() => onEdit(task)} aria-label="Edit task">
          <Icon name="edit" size={16} />
        </button>
        <button className="icon-btn sm danger" onClick={() => onDelete(task)} aria-label="Delete task">
          <Icon name="trash" size={16} />
        </button>
      </div>
    </div>
  );
}
