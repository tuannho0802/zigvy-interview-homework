import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import DateInput from "./DateInput";

type Props = {
  onKeywordChange: (keyword: string) => void;
  onDateChange: (date: string) => void;
};

export default function SearchBar({
  onKeywordChange,
  onDateChange,
}: Props) {
  const [keyword, setKeyword] = useState("");
  const [selectedDate, setSelectedDate] =
    useState<Date | null>(null);

  const handleDateChange = (
    date: Date | null
  ) => {
    setSelectedDate(date);
    onDateChange(
      date ? format(date, "yyyy-MM-dd") : ""
    );
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <input
        type="text"
        placeholder="Search by title or description"
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          onKeywordChange(e.target.value);
        }}
        className="px-3 py-2 rounded text-sm text-black dark:text-white bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full sm:w-auto"
      />

      <div className="relative w-full sm:w-auto">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          placeholderText="Search by due date"
          dateFormat="yyyy-MM-dd"
          customInput={<DateInput />}
          calendarClassName="dark:bg-zinc-800 dark:text-white"
          popperPlacement="bottom-start"
        />
      </div>
    </div>
  );
}
