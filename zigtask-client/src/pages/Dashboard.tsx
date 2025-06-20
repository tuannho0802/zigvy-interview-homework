import { useEffect, useState } from "react";
import api from "../api/axios";

type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: "To Do" | "In Progress" | "Done";
};

const emptyForm = {
  title: "",
  description: "",
  dueDate: "",
  status: "To Do" as Task["status"],
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(
    []
  );
  const [taskForm, setTaskForm] =
    useState(emptyForm);
  const [editingId, setEditingId] = useState<
    number | null
  >(null);
  const [showForm, setShowForm] =
    useState(false);

  const fetchTasks = () => {
    api
      .get("/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch tasks.");
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const groupByStatus = (
    status: Task["status"]
  ) =>
    tasks.filter(
      (task) => task.status === status
    );

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Edit mode
        await api.patch(
          `/tasks/${editingId}`,
          taskForm
        );
      } else {
        // Create mode
        await api.post("/tasks", taskForm);
      }

      setTaskForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert(
        editingId
          ? "Update failed"
          : "Create failed"
      );
    }
  };

  const handleEdit = (task: Task) => {
    const confirmed = window.confirm(
      `Edit task "${task.title}"?`
    );
    if (!confirmed) return;

    setTaskForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.slice(0, 10), // format for date input
      status: task.status,
    });
    setEditingId(task.id);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this task?"))
      return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  useEffect(() => {
    document.title = "Dashboard | ZigTask";
  }, []);

  return (
    <div className="min-h-screen min-w-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 p-6 transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🗂️ Your Tasks
      </h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setTaskForm(emptyForm);
            setEditingId(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm
            ? "Cancel"
            : "+ Create Task"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-800 shadow rounded p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            required
            className="border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 p-2 rounded"
            placeholder="Title"
            value={taskForm.title}
            onChange={(e) =>
              setTaskForm({
                ...taskForm,
                title: e.target.value,
              })
            }
          />
          <input
            required
            className="border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 p-2 rounded"
            placeholder="Description"
            value={taskForm.description}
            onChange={(e) =>
              setTaskForm({
                ...taskForm,
                description: e.target.value,
              })
            }
          />
          <input
            required
            type="date"
            className="border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 p-2 rounded"
            value={taskForm.dueDate}
            onChange={(e) =>
              setTaskForm({
                ...taskForm,
                dueDate: e.target.value,
              })
            }
          />
          <select
            className="border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 p-2 rounded"
            value={taskForm.status}
            onChange={(e) =>
              setTaskForm({
                ...taskForm,
                status: e.target
                  .value as Task["status"],
              })
            }
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
          <button
            type="submit"
            className="md:col-span-4 mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Task
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["To Do", "In Progress", "Done"].map(
          (status) => (
            <div
              key={status}
              className="bg-white dark:bg-zinc-800 shadow rounded p-4 transition-colors duration-300"
            >
              <h2 className="text-xl font-semibold mb-3">
                {status}
              </h2>
              <div className="space-y-2">
                {groupByStatus(
                  status as Task["status"]
                ).map((task) => (
                  <div
                    key={task.id}
                    className="p-3 border border-gray-200 dark:border-zinc-600 rounded shadow-sm bg-white dark:bg-zinc-700 transform transition-all duration-300 hover:scale-[1.05]"
                  >
                    <div className="font-medium">
                      {task.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {task.description}
                    </div>
                    <div className="text-xs text-gray-400">
                      Due:{" "}
                      {new Date(
                        task.dueDate
                      ).toLocaleDateString()}
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() =>
                          handleEdit(task)
                        }
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(task.id)
                        }
                        className="text-sm text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {groupByStatus(
                  status as Task["status"]
                ).length === 0 && (
                  <p className="text-sm text-gray-400">
                    No tasks
                  </p>
                )}
              </div>
            </div>
          )
        )}
      </div>

      {editingId && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 dark:bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg p-6 w-full max-w-md animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">
              Edit Task
            </h2>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                required
                className="w-full border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 p-2 rounded"
                placeholder="Title"
                value={taskForm.title}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    title: e.target.value,
                  })
                }
              />
              <input
                required
                className="w-full border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 p-2 rounded"
                placeholder="Description"
                value={taskForm.description}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    description: e.target.value,
                  })
                }
              />
              <input
                required
                type="date"
                className="w-full border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 p-2 rounded"
                value={taskForm.dueDate}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    dueDate: e.target.value,
                  })
                }
              />
              <select
                className="w-full border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 p-2 rounded"
                value={taskForm.status}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    status: e.target
                      .value as Task["status"],
                  })
                }
              >
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setTaskForm(emptyForm);
                  }}
                  className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
