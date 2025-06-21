import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login | ZigTask";
  }, []);

  // Apply theme on load
  useEffect(() => {
    const saved =
      localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.classList.toggle(
      "dark",
      saved === "dark"
    );
  }, []);

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

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/auth/signin",
        {
          email,
          password,
        }
      );
      localStorage.setItem(
        "token",
        res.data.access_token
      );
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 px-4 transition-colors duration-300 relative">
      {/*  Dark mode toggle button (top-right) */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-6 bg-zinc-600 dark:bg-zinc-700 text-white px-3 py-1 rounded hover:bg-zinc-500 dark:hover:bg-zinc-600 transition"
        title="Toggle Dark Mode"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <p className="mb-6 text-2xl md:text-3xl font-extrabold text-center text-blue-700 dark:text-blue-400 tracking-wide">
        🚀 To-do Task Manager
      </p>

      {/*  Login form */}
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-zinc-800 w-full max-w-sm p-6 rounded-lg shadow-lg"
      >
        <div className="flex justify-center font-thin antialiased text-xs mb-1 italic text-gray-400">
          Provided by
        </div>
        <div className="flex justify-center mb-3">
          <img
            src="https://zigvy.com/wp-content/uploads/2017/12/zigvy-logo.svg"
            alt="Zigvy Logo"
            className="min-h-10 w-auto p-4 text-center bg-zinc-700 dark:bg-zinc-800"
          />
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center">
          Sign In
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-black dark:text-white rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-black dark:text-white rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          Sign In
        </button>

        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
}
