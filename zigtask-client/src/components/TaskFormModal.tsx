import React, {
  useState,
  useEffect,
} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from "date-fns";
import DateInput from "./DateInput";

export type TaskFormData = {
  title: string;
  description: string;
  dueDate: string;
  status: "To Do" | "In Progress" | "Done";
};

type Props = {
  initialData: TaskFormData;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
};

export default function TaskFormModal({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}: Props) {
  const [form, setForm] =
    useState<TaskFormData>(initialData);
  const [dateObject, setDateObject] =
    useState<Date | null>(
      initialData.dueDate
        ? parseISO(initialData.dueDate)
        : null
    );

  useEffect(() => {
    setForm(initialData);
    setDateObject(
      initialData.dueDate
        ? parseISO(initialData.dueDate)
        : null
    );
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (
    date: Date | null
  ) => {
    setDateObject(date);
    setForm((prev) => ({
      ...prev,
      dueDate: date
        ? format(date, "yyyy-MM-dd")
        : "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-2xl mx-2 relative">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isEdit
            ? "Edit Task"
            : "Create New Task"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            required
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="w-full pr-10 pl-3 py-2 rounded border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            required
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full pr-10 pl-3 py-2 rounded border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          {/* Date Picker */}
          <div className="w-auto">
            <DatePicker
              selected={dateObject}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              customInput={<DateInput />}
            />
          </div>

          <select
            required
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full pr-10 pl-3 py-2 rounded border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>

          <div className="md:col-span-2 flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onCancel}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {isEdit ? "Update" : "Save"} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
