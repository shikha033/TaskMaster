import { Router } from "express";
import Task from "../models/Task.js";
import { protect } from "../middleware/auth.js";
import { HttpError } from "../utils/HttpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.use(protect); // every task route needs a logged-in user

const EDITABLE_FIELDS = ["title", "description", "priority", "category", "status", "due_date"];

// Copy only the fields a user is allowed to set.
const pickFields = (body) =>
  Object.fromEntries(
    EDITABLE_FIELDS.filter((key) => key in body).map((key) => [key, body[key]])
  );

// Every query is scoped to the logged-in user.
const ownTask = (req) => ({ _id: req.params.id, user: req.user._id });

// GET /api/tasks
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const tasks = await Task.find({ user: req.user._id }).sort({ created_at: -1 });
    res.json(tasks);
  })
);

// POST /api/tasks
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const task = await Task.create({ ...pickFields(req.body), user: req.user._id });
    res.status(201).json(task);
  })
);

// POST /api/tasks/seed  (adds sample tasks for demos)
router.post(
  "/seed",
  asyncHandler(async (req, res) => {
    const inDays = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const samples = [
      { title: "Complete DBMS Notes", description: "Summarize normalization and indexing chapters.", priority: "High", category: "Study", status: "Pending", due_date: inDays(1) },
      { title: "Prepare Internship Report", description: "Draft project overview and screenshots section.", priority: "Urgent", category: "Work", status: "Pending", due_date: inDays(0.5) },
      { title: "React Revision", description: "Revise hooks, context and routing.", priority: "Medium", category: "Study", status: "Completed", due_date: inDays(-2) },
      { title: "Submit Assignment", description: "Upload the final PDF to the college portal.", priority: "High", category: "Study", status: "Completed", due_date: inDays(-1) },
    ];
    const created = await Task.insertMany(
      samples.map((task) => ({ ...task, user: req.user._id }))
    );
    res.status(201).json(created);
  })
);

// PUT /api/tasks/:id
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const task = await Task.findOneAndUpdate(ownTask(req), pickFields(req.body), {
      new: true,
      runValidators: true,
    });
    if (!task) throw new HttpError(404, "Task not found.");
    res.json(task);
  })
);

// PATCH /api/tasks/:id/status
router.patch(
  "/:id/status",
  asyncHandler(async (req, res) => {
    const task = await Task.findOneAndUpdate(
      ownTask(req),
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!task) throw new HttpError(404, "Task not found.");
    res.json(task);
  })
);

// DELETE /api/tasks/:id
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const task = await Task.findOneAndDelete(ownTask(req));
    if (!task) throw new HttpError(404, "Task not found.");
    res.status(204).end();
  })
);

export default router;
