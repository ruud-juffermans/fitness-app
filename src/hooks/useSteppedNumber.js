import { useCallback, useEffect, useMemo, useState } from "react";

function decimalsOf(n) {
  const s = `${n}`;
  const i = s.indexOf(".");
  return i === -1 ? 0 : s.length - i - 1;
}

export function useSteppedNumber({
  value, // controlled (number | string)
  defaultValue, // uncontrolled initial (number | string)
  onChange, // (next:number) => void
  step = 2.5,
  min = 0,
  max = 500,
  placeholder = "0.0",
}) {
  const precision = useMemo(() => decimalsOf(step), [step]);

  const clamp = useCallback((n) => Math.min(max, Math.max(min, n)), [min, max]);

  const snapToStep = useCallback(
    (n) => {
      const k = Math.round((n - min) / step);
      const snapped = min + k * step;
      return Number(clamp(snapped).toFixed(precision));
    },
    [min, step, clamp, precision]
  );

  const normalizeNumber = useCallback((v) => {
    if (v === null || v === undefined) return undefined;
    if (typeof v === "number") return v;
    const parsed = parseFloat(v);
    return Number.isNaN(parsed) ? undefined : parsed;
  }, []);

  const isControlled = value !== undefined;

  // internal state only matters when uncontrolled
  const [internal, setInternal] = useState(() => {
    const startRaw = value ?? defaultValue ?? min;
    const startNum = normalizeNumber(startRaw) ?? min;
    return snapToStep(startNum);
  });

  // sync internal when controlled
  useEffect(() => {
    if (!isControlled) return;
    const numeric = normalizeNumber(value);
    if (numeric === undefined) return;
    setInternal(snapToStep(numeric));
  }, [isControlled, value, normalizeNumber, snapToStep]);

  const current = useMemo(() => {
    const numeric = normalizeNumber(value);
    if (numeric !== undefined) return snapToStep(numeric);
    return internal;
  }, [value, internal, normalizeNumber, snapToStep]);

  const emit = useCallback((next) => onChange?.(next), [onChange]);

  const setValue = useCallback(
    (nextRaw) => {
      const next = snapToStep(nextRaw);
      if (!isControlled) setInternal(next);
      emit(next);
      return next;
    },
    [isControlled, snapToStep, emit]
  );

  const increment = useCallback(() => setValue(current + step), [current, step, setValue]);
  const decrement = useCallback(() => setValue(current - step), [current, step, setValue]);

  const options = useMemo(() => {
    const out = [];
    const steps = Math.floor((max - min) / step) + 1;
    for (let i = 0; i < steps; i++) {
      out.push(Number((min + i * step).toFixed(precision)));
    }
    if (out[out.length - 1] !== max) out.push(Number(max.toFixed(precision)));
    return out;
  }, [min, max, step, precision]);

  const display = useMemo(() => {
    return typeof current === "number" ? current.toFixed(precision) : placeholder;
  }, [current, precision, placeholder]);

  return {
    precision,
    current, // numeric
    display, // string
    options, // numeric list
    snapToStep,
    setValue, // (n:number) => number
    increment,
    decrement,
  };
}
