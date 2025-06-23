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
import TaskFormModal from "../components/TaskFormModal";
import { useNavigate } from "react-router-dom";
import type { TaskFormData } from "../components/TaskFormModal";

type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: "To Do" | "In Progress" | "Done";
};

const emptyForm: TaskFormData = {
  title: "",
  description: "",
  dueDate: "",
  status: "To Do",
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(
    []
  );
  const [taskForm, setTaskForm] =
    useState<TaskFormData>(emptyForm);
  const [editingId, setEditingId] = useState<
    number | null
  >(null);
  const [showForm, setShowForm] =
    useState(false);

  useEffect(() => {
    fetchTasks();
    document.title = "Dashboard | ZigTask";
  }, []);

  // Prevent users from going back
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    const preventGoBack = () => {
      window.history.pushState(
        null,
        "",
        window.location.href
      );
    };

    preventGoBack();

    window.addEventListener(
      "popstate",
      preventGoBack
    );

    return () => {
      window.removeEventListener(
        "popstate",
        preventGoBack
      );
    };
  }, [navigate]);

  const fetchTasks = () => {
    api
      .get("/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch tasks.");
      });
  };

  const [searchKeyword, setSearchKeyword] =
    useState("");
  const [searchDate, setSearchDate] =
    useState("");

  const localDateString = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(
      "en-CA"
    );

  const groupByStatus = (
    status: Task["status"]
  ) =>
    tasks.filter((task) => {
      const matchesKeyword =
        task.title
          .toLowerCase()
          .includes(
            searchKeyword.toLowerCase()
          ) ||
        task.description
          .toLowerCase()
          .includes(
            searchKeyword.toLowerCase()
          );

      const matchesDate =
        !searchDate ||
        localDateString(task.dueDate) ===
          searchDate;

      return (
        task.status === status &&
        matchesKeyword &&
        matchesDate
      );
    });

  const handleSubmit = async (
    data: TaskFormData
  ) => {
    try {
      if (editingId) {
        await api.patch(
          `/tasks/${editingId}`,
          data
        );
      } else {
        await api.post("/tasks", data);
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
    setTaskForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.slice(0, 10),
      status: task.status,
    });
    setEditingId(task.id);
    setShowForm(true);
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
      <Header
        onKeywordChange={setSearchKeyword}
        onDateChange={setSearchDate}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 p-4 transition duration-300">
        <h1 className="text-3xl font-bold mb-6 text-center">
          🗂️ Your Tasks
        </h1>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setShowForm(true);
              setTaskForm(emptyForm);
              setEditingId(null);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            + Create Task
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          autoScroll
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

        {showForm && (
          <TaskFormModal
            initialData={taskForm}
            onCancel={() => {
              setShowForm(false);
              setTaskForm(emptyForm);
              setEditingId(null);
            }}
            onSubmit={handleSubmit}
            isEdit={editingId !== null}
          />
        )}
      </div>
    </>
  );
}
