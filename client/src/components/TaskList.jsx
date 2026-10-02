import TaskCard from "./TaskCard.jsx";
import { Icon } from "./Icons.jsx";

export default function TaskList({ tasks, loading, onToggle, onEdit, onDelete, onAdd }) {
  if (loading) {
    return (
      <div className="list-loader">
        <div className="spinner" />
        <p>Loading your tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">
          <Icon name="list" size={30} />
        </span>
        <h3>No tasks here yet</h3>
        <p>Create your first task or adjust your filters to see results.</p>
        <button className="btn btn-primary" onClick={onAdd}>
          <Icon name="plus" size={18} /> Add Task
        </button>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((t) => (
        <TaskCard
          key={t.id}
          task={t}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
