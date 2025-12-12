import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext"; // CORRECT

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform"
    >
      {theme === "light" ? (
        <Moon className="text-gray-900" size={20} />
      ) : (
        <Sun className="text-yellow-300" size={20} />
      )}
    </button>
  );
}
