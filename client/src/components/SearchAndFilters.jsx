import { Icon } from "./Icons.jsx";

const PRIORITIES = ["All", "Low", "Medium", "High", "Urgent"];
const STATUSES = ["All", "Pending", "Completed"];
const CATEGORIES = ["All", "Study", "Work", "Personal", "Other"];

export default function SearchAndFilters({ filters, onChange }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="filters-bar">
      <div className="search-field">
        <Icon name="search" size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search by title, description or category..."
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>
          <span>Priority</span>
          <select value={filters.priority} onChange={(e) => set("priority", e.target.value)}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Status</span>
          <select value={filters.status} onChange={(e) => set("status", e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Category</span>
          <select value={filters.category} onChange={(e) => set("category", e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
