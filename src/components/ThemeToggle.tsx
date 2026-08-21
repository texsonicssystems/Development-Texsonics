import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const [showTip, setShowTip] = useState(false);
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <div className="fixed bottom-5 left-5 z-50 flex items-center">
      <button
        type="button"
        onClick={toggle}
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        onFocus={() => setShowTip(true)}
        onBlur={() => setShowTip(false)}
        aria-label={label}
        aria-pressed={isDark}
        className="group relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full border border-border bg-card/90 backdrop-blur-md text-foreground shadow-lg hover:border-primary hover:text-primary transition-all duration-300"
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

      {/* Custom tooltip — the native title= attribute goes unnoticed, so we
          render a visible label that appears on hover/focus. */}
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md border border-border bg-card px-3 py-1.5 tech-label text-foreground shadow-md transition-all duration-200 ${
          showTip ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

export default ThemeToggle;
