export default function ProgressBar({ completed, total, percent }) {
  return (
    <div className="progress-card">
      <div className="progress-head">
        <div>
          <h3 className="progress-title">Completion Progress</h3>
          <p className="progress-sub">
            {completed} out of {total} tasks completed
          </p>
        </div>
        <span className="progress-percent">{percent}%</span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
