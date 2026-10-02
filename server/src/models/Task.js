import mongoose from "mongoose";

export const PRIORITIES = ["Low", "Medium", "High", "Urgent"];
export const CATEGORIES = ["Study", "Work", "Personal", "Other"];
export const STATUSES = ["Pending", "Completed"];

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Task title is required."],
      trim: true,
      maxlength: 200,
    },
    description: { type: String, default: "", trim: true, maxlength: 2000 },
    priority: { type: String, enum: PRIORITIES, default: "Medium" },
    category: { type: String, enum: CATEGORIES, default: "Study" },
    status: { type: String, enum: STATUSES, default: "Pending" },
    due_date: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// The shape of a task sent to the React app.
taskSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.user;
    return ret;
  },
});

export default mongoose.model("Task", taskSchema);
