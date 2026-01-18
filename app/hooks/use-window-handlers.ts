import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook to manage window event handlers with automatic cleanup
 */
export default function useWindowHandlers() {
  const handlersReference = useRef<Set<EventListener>>(new Set());
  const handlersTypeReference = useRef<WeakMap<EventListener, string>>(
    new WeakMap(),
  );
  const registerWindowHandler = useCallback(
    (type: string, handler: (event: Event) => void) => {
      globalThis.addEventListener(type, handler);
      handlersReference.current.add(handler);
      handlersTypeReference.current.set(handler, type);
    },
    [],
  );

  const unregisterWindowHandler = useCallback(
    (type: string, handler: EventListener) => {
      globalThis.removeEventListener(type, handler);
      handlersReference.current.delete(handler);
      handlersTypeReference.current.delete(handler);
    },
    [],
  );

  useEffect(() => {
    return () => {
      for (const handler of handlersReference.current) {
        const type = handlersTypeReference.current.get(handler);
        if (type) {
          globalThis.removeEventListener(type, handler);
        }
      }
      handlersReference.current.clear();
    };
  }, []);

  return { registerWindowHandler, unregisterWindowHandler };
}
