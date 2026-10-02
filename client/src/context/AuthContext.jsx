import { createContext, useContext, useEffect, useState } from "react";
import { api, tokenStore } from "../services/api.js";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the session on page refresh using the saved token.
  useEffect(() => {
    if (!tokenStore.get()) {
      setLoading(false);
      return;
    }
    api("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
  }, []);

  // Save the token and user returned by the server after login / signup / reset.
  const startSession = ({ token, user }) => {
    tokenStore.set(token);
    setUser(user);
    return user;
  };

  // --- Sign up: email a code, then create the account ---
  const sendSignupOtp = async (email) => {
    await api("/auth/signup/send-otp", { method: "POST", body: { email } });
  };

  const verifyOtpAndSetPassword = async (email, otp, password, username) => {
    const data = await api("/auth/signup/verify", {
      method: "POST",
      body: { email, otp, password, username },
    });
    return startSession(data);
  };

  // --- Login ---
  const signIn = async (email, password) => {
    const data = await api("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    return startSession(data);
  };

  // --- Forgot password: email a code, then set a new password ---
  const sendResetOtp = async (email) => {
    await api("/auth/forgot/send-otp", { method: "POST", body: { email } });
  };

  const verifyResetOtp = async (email, otp, password) => {
    const data = await api("/auth/forgot/verify", {
      method: "POST",
      body: { email, otp, password },
    });
    return startSession(data);
  };

  const signOut = async () => {
    tokenStore.clear();
    setUser(null);
  };

  const value = {
    user,
    loading,
    sendSignupOtp,
    verifyOtpAndSetPassword,
    signIn,
    sendResetOtp,
    verifyResetOtp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
