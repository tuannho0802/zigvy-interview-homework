import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/auth/forgot-password",
        { email }
      );
      setMessage(
        "If this email is registered, a reset link has been sent."
      );
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-zinc-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-800 p-6 rounded shadow w-full max-w-md text-gray-900 dark:text-white"
      >
        <h2 className="text-2xl font-bold mb-4">
          Forgot Password
        </h2>
        <input
          type="email"
          required
          placeholder="Your registered email"
          className="w-full p-2 mb-4 rounded border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Send Reset Link
        </button>
        {message && (
          <p className="mt-4 text-sm">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
