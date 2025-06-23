import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    if (password !== confirm)
      return alert("Passwords do not match");
    try {
      await axios.post(
        "http://localhost:3000/auth/reset-password",
        {
          token,
          newPassword: password,
        }
      );
      alert("Password reset successfully!");
      window.location.href = "/";
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        alert(
          "Reset failed: " +
            (msg || "Unknown error")
        );
      } else {
        alert("Unexpected error occurred");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 max-w-md mx-auto"
    >
      <h1 className="text-4xl font-bold mb-4 text-gray-800">
        Reset Password
      </h1>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        required
        className="w-full border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-black dark:text-white rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirm}
        onChange={(e) =>
          setConfirm(e.target.value)
        }
        required
        className="w-full border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-black dark:text-white rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Reset Password
      </button>
    </form>
  );
}
