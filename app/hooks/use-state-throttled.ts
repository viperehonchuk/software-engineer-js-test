import { useCallback, useEffect, useRef, useState } from "react";

export default function useStateThrottled<T>(
  initialValue: T,
  delay: number,
): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const lastExecutedRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setThrottledValue = useCallback((newValue: T) => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecutedRef.current;

    if (timeSinceLastExecution >= delay) {
      setValue(newValue);
      lastExecutedRef.current = now;
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setValue(newValue);
        lastExecutedRef.current = Date.now();
      }, delay - timeSinceLastExecution);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [value, setThrottledValue];
}
