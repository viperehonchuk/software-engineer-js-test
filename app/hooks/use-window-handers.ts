import { useCallback, useEffect, useRef } from "react";

/**
 * Hook to manage window event handlers with automatic cleanup
 */
export default function useWindowHandlers() {
  const handlersRef = useRef<Set<EventListener>>(new Set());
  const handlersTypeRef = useRef<WeakMap<Function, string>>(new WeakMap());
  const registerWindowHandler = useCallback(
    (type: string, handler: (event: Event) => void) => {
      window.addEventListener(type, handler);
      handlersRef.current.add(handler);
      handlersTypeRef.current.set(handler, type);
    },
    [],
  );

  const unregisterWindowHandler = useCallback(
    (type: string, handler: EventListener) => {
      window.removeEventListener(type, handler);
      handlersRef.current.delete(handler);
      handlersTypeRef.current.delete(handler);
    },
    [],
  );

  useEffect(() => {
    return () => {
      handlersRef.current.forEach((handler) => {
        const type = handlersTypeRef.current.get(handler);
        if (type) {
          window.removeEventListener(type, handler as EventListener);
        }
      });
      handlersRef.current.clear();
    };
  }, []);

  return { registerWindowHandler, unregisterWindowHandler };
}
