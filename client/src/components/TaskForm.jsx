import { useState } from "react";
import { Icon } from "./Icons.jsx";
import { toInputValue } from "../lib/format.js";

const PRIORITIES = ["Low", "Medium", "High", "Urgent"];
const CATEGORIES = ["Study", "Work", "Personal", "Other"];

export default function TaskForm({ initial, onSave, onClose, saving }) {
  const editing = Boolean(initial);
  const [form, setForm] = useState({
    title: initial?.title || "",
    description: initial?.description || "",
    priority: initial?.priority || "Medium",
    category: initial?.category || "Study",
    status: initial?.status || "Pending",
    due_date: toInputValue(initial?.due_date),
  });
  const [error, setError] = useState("");

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Task title is required.");
      return;
    }
    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      category: form.category,
      status: form.status,
      due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{editing ? "Edit Task" : "Add New Task"}</h2>
          <button className="icon-btn sm" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form className="task-form" onSubmit={submit}>
          <label className="field">
            <span>Task Title</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Prepare internship report"
              autoFocus
            />
          </label>

          <label className="field">
            <span>Description</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Optional details about this task"
            />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Priority</span>
              <select value={form.priority} onChange={(e) => set("priority", e.target.value)}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Category</span>
              <select value={form.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Due Date</span>
              <input
                type="datetime-local"
                value={form.due_date}
                onChange={(e) => set("due_date", e.target.value)}
              />
            </label>

            <label className="field">
              <span>Status</span>
              <select value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </label>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Icon name={editing ? "edit" : "plus"} size={16} />
              {saving ? "Saving..." : editing ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
