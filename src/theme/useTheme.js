import getTheme from "./theme";

export function useTheme() {
  // const theme = useColorScheme() || "dark";
  const theme = "dark";
  const colors = getTheme[theme] || getTheme.dark; // fallback to light
  return { ...colors, theme };
}