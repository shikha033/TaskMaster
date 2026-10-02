import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { useNotifications } from "../hooks/useNotifications.js";
import { taskService } from "../services/taskService.js";
import Navbar from "../components/Navbar.jsx";
import StatsCards from "../components/StatsCards.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import Tabs from "../components/Tabs.jsx";
import SearchAndFilters from "../components/SearchAndFilters.jsx";
import TaskList from "../components/TaskList.jsx";
import TaskForm from "../components/TaskForm.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { Icon } from "../components/Icons.jsx";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const toast = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [activeTab, setActiveTab] = useState("All");
  const [filters, setFilters] = useState({
    search: "",
    priority: "All",
    status: "All",
    category: "All",
  });

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [confirmTask, setConfirmTask] = useState(null);

  const notifications = useNotifications(tasks);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (e) {
      toast.error("Could not load tasks: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Statistics (update automatically as tasks change) ---
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const pending = total - completed;
    const urgent = tasks.filter((t) => t.priority === "Urgent").length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, urgent, percent };
  }, [tasks]);

  const tabCounts = useMemo(
    () => ({
      All: tasks.length,
      Pending: tasks.filter((t) => t.status === "Pending").length,
      Completed: tasks.filter((t) => t.status === "Completed").length,
      Urgent: tasks.filter((t) => t.priority === "Urgent").length,
    }),
    [tasks]
  );

  // --- Search + filters + tabs all applied together ---
  const visibleTasks = useMemo(() => {
    let list = [...tasks];

    if (activeTab === "Pending") list = list.filter((t) => t.status === "Pending");
    else if (activeTab === "Completed") list = list.filter((t) => t.status === "Completed");
    else if (activeTab === "Urgent") list = list.filter((t) => t.priority === "Urgent");

    if (filters.priority !== "All") list = list.filter((t) => t.priority === filters.priority);
    if (filters.status !== "All") list = list.filter((t) => t.status === filters.status);
    if (filters.category !== "All") list = list.filter((t) => t.category === filters.category);

    const q = filters.search.trim().toLowerCase();
    if (q) {
      list = list.filter((t) =>
        `${t.title} ${t.description} ${t.category}`.toLowerCase().includes(q)
      );
    }
    return list;
  }, [tasks, activeTab, filters]);

  // --- Handlers ---
  const openAdd = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editingTask) {
        const updated = await taskService.updateTask(editingTask.id, data);
        setTasks((list) => list.map((t) => (t.id === updated.id ? updated : t)));
        toast.success("Task updated");
      } else {
        const created = await taskService.createTask(data);
        setTasks((list) => [created, ...list]);
        toast.success("Task added");
      }
      setShowForm(false);
      setEditingTask(null);
    } catch (e) {
      toast.error("Save failed: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (task) => {
    const next = task.status === "Completed" ? "Pending" : "Completed";
    try {
      const updated = await taskService.updateStatus(task.id, next);
      setTasks((list) => list.map((t) => (t.id === updated.id ? updated : t)));
    } catch (e) {
      toast.error("Update failed: " + e.message);
    }
  };

  const handleDelete = async () => {
    if (!confirmTask) return;
    try {
      await taskService.deleteTask(confirmTask.id);
      setTasks((list) => list.filter((t) => t.id !== confirmTask.id));
      toast.success("Task deleted");
    } catch (e) {
      toast.error("Delete failed: " + e.message);
    } finally {
      setConfirmTask(null);
    }
  };

  const handleSeed = async () => {
    try {
      const created = await taskService.seedDemoTasks();
      setTasks((list) => [...created, ...list]);
      toast.success("Sample tasks added");
    } catch (e) {
      toast.error("Could not add samples: " + e.message);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="dashboard">
      <Navbar user={user} onLogout={handleLogout} notifications={notifications} />

      <main className="dash-main">
        <div className="dash-header">
          <div>
            <h1 className="dash-greeting">Hello, {user.username} 👋</h1>
            <p className="dash-subtitle">Here's your productivity overview for today.</p>
          </div>
          <div className="dash-header-actions">
            {tasks.length === 0 && !loading && (
              <button className="btn btn-ghost" onClick={handleSeed}>
                Load sample tasks
              </button>
            )}
            <button className="btn btn-primary" onClick={openAdd}>
              <Icon name="plus" size={18} /> Add Task
            </button>
          </div>
        </div>

        <StatsCards stats={stats} />

        <ProgressBar
          completed={stats.completed}
          total={stats.total}
          percent={stats.percent}
        />

        <Tabs activeTab={activeTab} onChange={setActiveTab} counts={tabCounts} />

        <SearchAndFilters filters={filters} onChange={setFilters} />

        <TaskList
          tasks={visibleTasks}
          loading={loading}
          onToggle={handleToggle}
          onEdit={openEdit}
          onDelete={setConfirmTask}
          onAdd={openAdd}
        />
      </main>

      {showForm && (
        <TaskForm
          initial={editingTask}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
          saving={saving}
        />
      )}

      <ConfirmDialog
        open={Boolean(confirmTask)}
        title="Delete task?"
        message={`"${confirmTask?.title}" will be permanently removed. This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmTask(null)}
      />
    </div>
  );
}
