import { Icon } from "./Icons.jsx";

export default function StatsCards({ stats }) {
  const cards = [
    { key: "total", label: "Total Tasks", value: stats.total, icon: "list", tone: "indigo" },
    { key: "completed", label: "Completed", value: stats.completed, icon: "check", tone: "green" },
    { key: "pending", label: "Pending", value: stats.pending, icon: "clock", tone: "amber" },
    { key: "urgent", label: "Urgent", value: stats.urgent, icon: "fire", tone: "red" },
  ];

  return (
    <div className="stats-grid">
      {cards.map((c) => (
        <div key={c.key} className={`stat-card tone-${c.tone}`}>
          <span className="stat-icon">
            <Icon name={c.icon} />
          </span>
          <div className="stat-body">
            <span className="stat-value">{c.value}</span>
            <span className="stat-label">{c.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
