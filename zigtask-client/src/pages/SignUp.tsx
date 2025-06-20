import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Sign Up | ZigTask";
  }, []);

  // Apply saved theme on mount
  useEffect(() => {
    const saved =
      localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.classList.toggle(
      "dark",
      saved === "dark"
    );
  }, []);

  // Toggle dark/light
  const toggleTheme = () => {
    const newTheme =
      theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle(
      "dark",
      newTheme === "dark"
    );
  };

  const handleSignup = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/auth/signup",
        { email, password }
      );
      alert(
        "Signup successful. You can now log in."
      );
      navigate("/");
    } catch (err) {
      console.error("Signup failed:", err);
      alert(
        "Signup failed. Email may already be taken."
      );
    }
  };

  return (
    <div className="flex h-screen min-w-screen items-center justify-center bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Dark mode toggle top right */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 bg-zinc-600 dark:bg-zinc-700 text-white px-3 py-1 rounded hover:bg-zinc-500 dark:hover:bg-zinc-600 transition"
        title="Toggle Dark Mode"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <form
        onSubmit={handleSignup}
        className="bg-white dark:bg-zinc-800 p-6 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          Sign Up
        </h1>

        <input
          type="email"
          className="w-full border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-black dark:text-white p-2 mb-3 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <input
          type="password"
          className="w-full border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-black dark:text-white p-2 mb-4 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Create Account
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <a
            href="/"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
