import { useCallback, useRef } from 'react';

export default function useThrottledCallback<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...arguments_: any[]) => any,
>(callback: T, delay: number): T {
  const lastExecutedReference = useRef<number>(0);
  const timeoutReference = useRef<NodeJS.Timeout | null>(null);
  return useCallback(
    (...arguments_: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastExecution = now - lastExecutedReference.current;

      if (timeSinceLastExecution >= delay) {
        callback(...arguments_);
        lastExecutedReference.current = now;
      } else {
        if (timeoutReference.current) {
          clearTimeout(timeoutReference.current);
        }
        timeoutReference.current = setTimeout(() => {
          callback(...arguments_);
          lastExecutedReference.current = Date.now();
        }, delay - timeSinceLastExecution);
      }
    },
    [callback, delay],
  ) as T;
}
