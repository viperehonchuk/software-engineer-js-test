import { useCallback, useEffect, useRef, useState } from 'react';

export default function useStateThrottled<T>(
  initialValue: T,
  delay: number,
): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const lastExecutedReference = useRef<number>(0);
  const timeoutReference = useRef<NodeJS.Timeout | null>(null);

  const setThrottledValue = useCallback((newValue: T) => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecutedReference.current;

    if (timeSinceLastExecution >= delay) {
      setValue(newValue);
      lastExecutedReference.current = now;
    } else {
      if (timeoutReference.current) {
        clearTimeout(timeoutReference.current);
      }
      timeoutReference.current = setTimeout(() => {
        setValue(newValue);
        lastExecutedReference.current = Date.now();
      }, delay - timeSinceLastExecution);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutReference.current) {
        clearTimeout(timeoutReference.current);
      }
    };
  }, []);

  return [value, setThrottledValue];
}
