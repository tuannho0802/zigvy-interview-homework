// src/components/SearchBar.tsx
import { useState } from "react";

type Props = {
  onSearch: (query: string) => void;
};

export default function SearchBar({
  onSearch,
}: Props) {
  const [query, setQuery] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <input
      type="text"
      placeholder="Search tasks..."
      value={query}
      onChange={handleChange}
      className="px-3 py-1 rounded text-sm text-black dark:text-white bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 placeholder-gray-500"
    />
  );
}
