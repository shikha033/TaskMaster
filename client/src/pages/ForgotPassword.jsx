import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import "../styles/auth.css";

export default function ForgotPassword() {
  const { sendResetOtp, verifyResetOtp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState("email"); // email -> reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const sendCode = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await sendResetOtp(email);
      toast.success("Reset code sent to your email.");
      setStep("reset");
    } catch (err) {
      toast.error(err.message || "Could not send code");
    } finally {
      setBusy(false);
    }
  };

  const reset = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    try {
      await verifyResetOtp(email, otp, password);
      toast.success("Password updated! You're logged in.");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message || "Reset failed");
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
          <h2>Forgot your password?</h2>
          <p>No worries — reset it in a couple of steps and get back to work.</p>
        </div>
      </aside>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-brand">
            <span className="auth-mark">✓</span> TaskMaster
          </div>

          {step === "email" ? (
            <>
              <h1>Reset password</h1>
              <p className="auth-lead">Enter your email to receive a reset code.</p>
              <form onSubmit={sendCode} className="auth-form">
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
                <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
                  {busy ? "Sending..." : "Send Reset Code"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1>Set new password</h1>
              <p className="auth-lead">
                Enter the code sent to <strong>{email}</strong> and your new password.
              </p>
              <form onSubmit={reset} className="auth-form">
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
                <label className="field">
                  <span>New Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                  />
                </label>
                <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
                  {busy ? "Updating..." : "Update Password"}
                </button>
              </form>
            </>
          )}

          <p className="auth-switch">
            Remembered it? <Link to="/login">Back to login</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
