import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import "../styles/auth.css";

export default function Login() {
  const { user, loading, signIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/", { replace: true });
  }, [user, loading, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signIn(email, password);
      toast.success("Welcome back!");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message || "Login failed");
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-hero">
        <div className="auth-hero-brand">
          <span className="auth-hero-mark">✓</span> TaskMaster
        </div>
        <div className="auth-hero-preview" aria-hidden="true">
          <div className="hero-task hero-task--done">
            <span className="hero-check">✓</span>
            <span className="hero-bar" style={{ width: "60%" }} />
          </div>
          <div className="hero-task">
            <span className="hero-box" />
            <span className="hero-bar" style={{ width: "82%" }} />
          </div>
          <div className="hero-task">
            <span className="hero-box" />
            <span className="hero-bar" style={{ width: "48%" }} />
          </div>
          <div className="hero-progress">
            <span />
          </div>
        </div>
        <div className="auth-hero-overlay">
          <h2>Stay on top of everything.</h2>
          <p>Organize tasks, track progress, and never miss a deadline again.</p>
        </div>
      </aside>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-brand">
            <span className="auth-mark">✓</span> TaskMaster
          </div>
          <h1>Welcome back</h1>
          <p className="auth-lead">Log in to manage your tasks.</p>

          <form onSubmit={submit} className="auth-form">
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
            </label>

            <div className="auth-row-end">
              <Link to="/forgot-password" className="link-btn">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="auth-switch">
            New to TaskMaster? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
