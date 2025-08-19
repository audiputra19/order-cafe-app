import clsx from "clsx";
import { useEffect } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../store";
import { toggleDarkMode } from "../store/DarkModeSlice";

export default function DarkModeSwitch() {
  const dispatch = useAppDispatch();
  const isDark = useAppSelector(state => state.darkMode.isDark);

  useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
  }, [isDark]);

  return (
    <button
        onClick={() => dispatch(toggleDarkMode())}
        className="relative flex items-center w-17 h-9 rounded-full bg-card transition-colors duration-300 cursor-pointer focus:outline-none"
    >
        <span
            className={clsx("absolute left-1 w-7 h-7 rounded-full bg-white shadow-md transform transition-transform duration-300",
                isDark ? "translate-x-8" : ""
            )}
        />
        <span className={clsx("absolute left-2",
            isDark ? "text-white" : "text-primary"
        )}>
            <FiSun size={20} />
        </span>
        <span className={clsx("absolute right-2",
            !isDark ? "text-white" : "text-primary"
        )}>
            <FiMoon size={20} />
        </span>
    </button>
  );
}
