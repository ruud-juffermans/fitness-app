import { useCallback, useContext } from "react";
import { ToastContext } from "@state/ToastProvider";

const DEFAULT_DURATION = 1500;

export function useSnackbar() {
  const toast = useContext(ToastContext);
  if (!toast) {
    throw new Error("useSnackbar must be used inside ToastProvider");
  }

  const setInfo = useCallback(
    (message, duration = DEFAULT_DURATION) =>
      toast.show(message, "info", duration),
    [toast]
  );

  const setSuccess = useCallback(
    (message, duration = DEFAULT_DURATION) =>
      toast.show(message, "success", duration),
    [toast]
  );

  const setError = useCallback(
    (message, duration = DEFAULT_DURATION) =>
      toast.show(message, "error", duration),
    [toast]
  );

  return {
    setInfo,
    setSuccess,
    setError,
  };
}
