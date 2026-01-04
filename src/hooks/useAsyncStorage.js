import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function usePersistentState(key, initialValue) {
  const [state, setState] = useState(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(key).then((val) => {
      if (val != null) setState(JSON.parse(val));
      setHydrated(true);
    });
  }, [key]);

  useEffect(() => {
    if (hydrated) {
      AsyncStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state, hydrated]);

  return [state, setState, hydrated];
}