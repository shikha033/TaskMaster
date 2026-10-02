import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, maxlength: 60 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true }, // bcrypt hash
  },
  { timestamps: true }
);

// The shape of the user sent to the React app (never includes the password).
userSchema.methods.toPublic = function () {
  return { id: this._id.toString(), email: this.email, username: this.username };
};

export default mongoose.model("User", userSchema);
