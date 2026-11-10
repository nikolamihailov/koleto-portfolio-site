import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const read = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** Reads a CSS custom property from :root and re-reads it whenever the theme changes. */
export function useCssVar(name: string) {
  const { theme } = useTheme();
  const [value, setValue] = useState(() => read(name));

  useEffect(() => {
    setValue(read(name));
  }, [theme, name]);

  return value;
}
