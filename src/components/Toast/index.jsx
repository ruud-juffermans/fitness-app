import { Animated, Text, StyleSheet } from "react-native";
import { useTheme } from "@theme/useTheme";

export function Toast({ message, type, opacity }) {
  const { colors } = useTheme();
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


const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    padding: 6,
    elevation: 4,
  },
  info: { backgroundColor: "red" },
  success: { backgroundColor: "#2e7d32" },
  error: { backgroundColor: "#c62828" },
  text: { color: "#fff", textAlign: "center" },
});