import { useTheme } from "@theme/useTheme";
import { Animated, StyleSheet, Text } from "react-native";

export function Toast({ message, type, opacity }) {
  const { components } = useTheme();
  const c = components.toast;

  const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 110,
    left: 10,
    right: 10,
    padding: c.padding,
    borderRadius: c.borderRadius,
    backgroundColor: c.backgroundColor,
  },
  info: { backgroundColor: "red" },
  success: { backgroundColor: "#2e7d32" },
  error: { backgroundColor: "#c62828" },
  text: { color: "#fff", textAlign: "center" },
});

  return (
    <Animated.View
      style={[
        styles.toast,
        styles[type],
        { opacity: opacity },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}


