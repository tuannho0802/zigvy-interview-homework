import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

type HeaderProps = {
  onSearch?: (query: string) => void;
};

export default function Header({
  onSearch,
}: HeaderProps) {
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
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 bg-cyan-900 dark:bg-gray-950 p-4 shadow text-white dark:text-gray-100 transition-colors duration-300 w-full overflow-hidden">
      <div className="flex items-center gap-3 flex-wrap text-center md:text-left">
        <img
          src="https://zigvy.com/wp-content/uploads/2017/12/zigvy-logo.svg"
          alt="Zigvy Logo"
          className="h-10 w-auto"
        />
        <h1 className="text-2xl md:text-4xl font-semibold">
          Welcome{" "}
          <span className="text-red-500 dark:text-sky-400 italic text-lg md:text-2xl ml-1">
            {user.email || "User"}
          </span>
        </h1>
      </div>

      <div className="flex items-center flex-wrap justify-center gap-2 md:gap-4 w-full md:w-auto">
        {onSearch && (
          <SearchBar onSearch={onSearch} />
        )}
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
