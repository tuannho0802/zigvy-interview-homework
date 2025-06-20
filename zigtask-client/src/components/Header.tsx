import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved =
      localStorage.getItem("theme") || "light";
    setTheme(saved);

    if (saved === "dark") {
      document.documentElement.classList.add(
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );
    }
  }, []);

  const toggleTheme = () => {
    const newTheme =
      theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add(
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return (
    <header className="flex items-center justify-between bg-cyan-900 dark:bg-gray-950 p-4 shadow text-white dark:text-gray-100 transition-colors duration-300">
      <p className="text-7xl">
        Welcome{" "}
        <span className="text-red-500 dark:text-sky-400 italic text-3xl">
          {user.email || "User"}
        </span>
      </p>

      <div className="flex items-center gap-4">
        {/* 🌗 Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="bg-zinc-600 dark:bg-zinc-700 hover:bg-zinc-500 dark:hover:bg-zinc-600 px-3 py-1 rounded text-sm transition-colors"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-1 rounded text-sm"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
