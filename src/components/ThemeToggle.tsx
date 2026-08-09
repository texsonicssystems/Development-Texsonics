import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed bottom-5 left-5 z-50 group flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full border border-border bg-card/90 backdrop-blur-md text-foreground shadow-lg hover:border-primary hover:text-primary transition-all duration-300"
    >
      <Sun
        className={`absolute w-5 h-5 transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          isDark
            ? "-rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100 text-primary"
        }`}
      />
      <Moon
        className={`absolute w-5 h-5 transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          isDark
            ? "rotate-0 scale-100 opacity-100 text-primary"
            : "rotate-90 scale-0 opacity-0"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
