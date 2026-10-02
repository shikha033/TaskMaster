import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import "../styles/auth.css";

export default function Signup() {
  const { user, loading, sendSignupOtp, verifyOtpAndSetPassword } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState("details"); // details -> verify
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/", { replace: true });
  }, [user, loading, navigate]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submitDetails = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      await sendSignupOtp(form.email);
      toast.success("Verification code sent to your email.");
      setStep("verify");
    } catch (err) {
      toast.error(err.message || "Could not send code");
    } finally {
      setBusy(false);
    }
  };

  const submitVerify = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await verifyOtpAndSetPassword(form.email, otp, form.password, form.name);
      toast.success("Account verified! Welcome to TaskMaster.");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message || "Verification failed");
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
          <h2>Start organizing today.</h2>
          <p>Create tasks, set priorities, and track your progress with ease.</p>
        </div>
      </aside>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-brand">
            <span className="auth-mark">✓</span> TaskMaster
          </div>

          {step === "details" ? (
            <>
              <h1>Create your account</h1>
              <p className="auth-lead">It only takes a minute.</p>

              <form onSubmit={submitDetails} className="auth-form">
                <label className="field">
                  <span>Name</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </label>
                <label className="field">
                  <span>Password</span>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder="At least 6 characters"
                    required
                  />
                </label>
                <label className="field">
                  <span>Confirm Password</span>
                  <input
                    type="password"
                    value={form.confirm}
                    onChange={(e) => set("confirm", e.target.value)}
                    placeholder="Re-enter password"
                    required
                  />
                </label>

                <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
                  {busy ? "Sending code..." : "Sign Up"}
                </button>
              </form>

              <p className="auth-switch">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </>
          ) : (
            <>
              <h1>Verify your email</h1>
              <p className="auth-lead">
                We sent a code to <strong>{form.email}</strong>. Enter it below to
                activate your account.
              </p>

              <form onSubmit={submitVerify} className="auth-form">
                <label className="field">
                  <span>Verification Code</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter the code"
                    required
                  />
                </label>

                <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
                  {busy ? "Verifying..." : "Verify & Continue"}
                </button>
              </form>

              <p className="auth-switch">
                Didn't get it?{" "}
                <button className="link-btn" onClick={() => setStep("details")}>
                  Change email
                </button>
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
