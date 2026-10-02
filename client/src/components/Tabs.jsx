import { Icon } from "./Icons.jsx";

export default function Tabs({ activeTab, onChange, counts }) {
  const tabs = [
    { key: "All", label: "All", icon: "list" },
    { key: "Pending", label: "Pending", icon: "clock" },
    { key: "Completed", label: "Completed", icon: "check" },
    { key: "Urgent", label: "Urgent", icon: "fire" },
  ];

  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button
          key={t.key}
          className={`tab ${activeTab === t.key ? "tab-active" : ""}`}
          onClick={() => onChange(t.key)}
        >
          <Icon name={t.icon} size={16} />
          <span>{t.label}</span>
          <span className="tab-count">{counts[t.key]}</span>
        </button>
      ))}
    </div>
  );
}
