import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] =
    useState("");
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  useEffect(() => {
    document.title = "Sign Up | ZigTask";
  }, []);

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

  const handleSignup = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (password !== retypePassword) {
      alert("Passwords do not match.");
      return;
    }

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
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 px-4 transition-colors duration-300 relative">
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

      <form
        onSubmit={handleSignup}
        className="bg-white dark:bg-zinc-800 w-full max-w-sm p-6 rounded-lg shadow-lg"
      >
        <div className="flex justify-center font-thin antialiased text-xs mb-1 italic text-gray-400">
          Provided by
        </div>
        <div className="flex justify-center mb-3">
          <img
            src="https://zigvy.com/wp-content/uploads/2017/12/zigvy-logo.svg"
            alt="Zigvy Logo"
            className="min-h-10 w-auto p-4 bg-zinc-700 dark:bg-zinc-800 rounded"
          />
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center">
          Sign Up
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-black dark:text-white p-2 mb-3 rounded"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-black dark:text-white p-2 mb-3 rounded"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        <input
          type="password"
          placeholder="Retype Password"
          className="w-full border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-black dark:text-white p-2 mb-4 rounded"
          value={retypePassword}
          onChange={(e) =>
            setRetypePassword(e.target.value)
          }
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Create Account
        </button>

        <p className="text-sm mt-4 text-center text-gray-600 dark:text-gray-300">
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
