/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import api from "../api/axios";
import Header from "../components/Header";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableTask from "../components/SortableTask";
import ColumnDroppable from "../components/ColumnDroppable";

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
  const [searchQuery, setSearchQuery] =
    useState("");

  useEffect(() => {
    fetchTasks();
    document.title = "Dashboard | ZigTask";
  }, []);

  const fetchTasks = () => {
    api
      .get("/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch tasks.");
      });
  };

  const groupByStatus = (
    status: Task["status"]
  ) =>
    tasks.filter(
      (task) =>
        task.status === status &&
        (task.title
          .toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          ) ||
          task.description
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            ) ||
          task.dueDate.includes(searchQuery))
    );

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(
          `/tasks/${editingId}`,
          taskForm
        );
      } else {
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
    if (
      !window.confirm(
        `Edit task "${task.title}"?`
      )
    )
      return;
    setTaskForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.slice(0, 10),
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

  const handleDragEnd = async (
    event: DragEndEvent
  ) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const draggedTask = tasks.find(
      (t) => t.id === +active.id
    );
    if (!draggedTask) return;

    // Fix: Get correct status from drop zone or item data
    const targetStatus =
      over.data.current?.status;

    if (
      targetStatus &&
      draggedTask.status !== targetStatus
    ) {
      await api.patch(
        `/tasks/${draggedTask.id}`,
        {
          ...draggedTask,
          status: targetStatus,
        }
      );
      fetchTasks();
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  return (
    <>
      <Header onSearch={setSearchQuery} />
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 p-4 transition duration-300">
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
              className="input-field"
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
              className="input-field"
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
              className="input-field"
              value={taskForm.dueDate}
              onChange={(e) =>
                setTaskForm({
                  ...taskForm,
                  dueDate: e.target.value,
                })
              }
            />
            <select
              className="input-field"
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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          autoScroll={true}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              "To Do",
              "In Progress",
              "Done",
            ].map((status) => (
              <div
                key={status}
                className="bg-white dark:bg-zinc-800 p-4 rounded shadow"
              >
                <h2 className="text-xl font-semibold mb-3">
                  {status}
                </h2>
                <SortableContext
                  items={groupByStatus(
                    status as Task["status"]
                  ).map((t) => t.id.toString())}
                  strategy={
                    verticalListSortingStrategy
                  }
                >
                  <ColumnDroppable id={status}>
                    {groupByStatus(
                      status as Task["status"]
                    ).map((task) => (
                      <SortableTask
                        key={task.id}
                        task={task}
                        onEdit={() =>
                          handleEdit(task)
                        }
                        onDelete={() =>
                          handleDelete(task.id)
                        }
                        column={status}
                      />
                    ))}
                    {groupByStatus(
                      status as Task["status"]
                    ).length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-2 italic bg-gray-100 dark:bg-zinc-700 rounded">
                        The task is empty
                      </p>
                    )}
                  </ColumnDroppable>
                </SortableContext>
              </div>
            ))}
          </div>
        </DndContext>
      </div>
    </>
  );
}
