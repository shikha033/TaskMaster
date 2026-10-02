import mongoose from "mongoose";

// One-time verification codes for signup and password reset.
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  purpose: { type: String, enum: ["signup", "reset"], required: true },
  codeHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  // MongoDB deletes the document automatically once this time passes.
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

otpSchema.index({ email: 1, purpose: 1 }, { unique: true });

export default mongoose.model("Otp", otpSchema);
