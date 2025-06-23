import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

type HeaderProps = {
  onKeywordChange?: (keyword: string) => void;
  onDateChange?: (date: string) => void;
};

export default function Header({
  onKeywordChange,
  onDateChange,
}: HeaderProps) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [
    showConfirmModal,
    setShowConfirmModal,
  ] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberedEmail");
    navigate("/", { replace: true });
  };

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return (
    <>
      <header className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 bg-cyan-900 dark:bg-gray-950 p-4 shadow text-white dark:text-gray-100 transition-colors duration-300">
        <h1 className="text-2xl flex items-center gap-2">
          <img
            src="https://zigvy.com/wp-content/uploads/2017/12/zigvy-logo.svg"
            alt="Zigvy Logo"
            className="h-8 w-auto"
          />
          Welcome{" "}
          <span className="text-red-400 italic">
            {user.email || "User"}
          </span>
        </h1>

        <div className="flex flex-wrap gap-3 items-center">
          {onKeywordChange && onDateChange && (
            <SearchBar
              onKeywordChange={onKeywordChange}
              onDateChange={onDateChange}
            />
          )}
          <button
            onClick={toggleTheme}
            className="bg-zinc-600 dark:bg-zinc-700 hover:bg-zinc-500 dark:hover:bg-zinc-600 px-3 py-1 rounded text-sm transition-colors"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <button
            onClick={() =>
              setShowConfirmModal(true)
            }
            className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-1 rounded text-sm"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Confirm Logout Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg text-gray-900 dark:text-white w-full max-w-sm mx-4">
            <h2 className="text-lg font-bold mb-4">
              Confirm Logout
            </h2>
            <p className="mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setShowConfirmModal(false)
                }
                className="bg-gray-300 dark:bg-zinc-700 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-zinc-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
              >
                Yes, Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
