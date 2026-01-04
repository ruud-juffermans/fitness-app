import { createContext, useRef, useState, useCallback } from "react";
import { Animated } from "react-native";
import { Toast } from "@components/Toast";

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
const opacity = useRef(new Animated.Value(0)).current;

    const animate = useCallback(
      (duration, onEnd) => {
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.delay(duration),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(onEnd);
      },
      [opacity]
    );


const show = useCallback((message, type, duration) => {
    setToast({ message, type });

    animate(duration, () => {
      setToast(null);
    });
  }, [animate]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          opacity={opacity}
        />
      )}
    </ToastContext.Provider>
  );
}