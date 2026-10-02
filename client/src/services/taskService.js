import { api } from "./api.js";

/**
 * taskService is the frontend data layer. Each method is one REST call
 * to the Express API, which reads and writes the MongoDB "tasks" collection
 * for the logged-in user.
 */
export const taskService = {
  // GET /api/tasks
  getTasks: () => api("/tasks"),

  // POST /api/tasks
  createTask: (task) => api("/tasks", { method: "POST", body: task }),

  // PUT /api/tasks/:id
  updateTask: (id, updates) =>
    api(`/tasks/${id}`, { method: "PUT", body: updates }),

  // PATCH /api/tasks/:id/status
  updateStatus: (id, status) =>
    api(`/tasks/${id}/status`, { method: "PATCH", body: { status } }),

  // DELETE /api/tasks/:id
  deleteTask: (id) => api(`/tasks/${id}`, { method: "DELETE" }),

  // POST /api/tasks/seed  (adds sample tasks for demos)
  seedDemoTasks: () => api("/tasks/seed", { method: "POST" }),
};
