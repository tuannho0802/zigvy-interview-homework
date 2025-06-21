import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: "To Do" | "In Progress" | "Done";
};

export default function SortableTask({
  task,
  onEdit,
  onDelete,
  column,
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  column: string;
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({
    id: task.id.toString(),
    data: {
      type: "task",
      status: column,
    },
  });

  const style = {
    transform:
      CSS.Transform.toString(transform),
    transition,
    touchAction: "none", // IMPORTANT for mobile
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 mb-3 border border-gray-200 dark:border-zinc-600 rounded shadow-sm bg-white dark:bg-zinc-700 transition-all duration-200 hover:scale-[1.03] flex flex-col"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">
          {task.title}
        </div>

        {/* Only this handle is draggable */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </div>
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
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-sm text-red-500 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
