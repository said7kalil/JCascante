import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem("jc_theme") || "light");

  useEffect(() => {
    localStorage.setItem("jc_theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggle }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
};
