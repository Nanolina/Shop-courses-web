import { useEffect, useState } from 'react';

export function useAsyncInitialize<T>(
  // function that creates our client
  func: () => Promise<T>,
  // dependency array
  deps: any[] = []
) {
  const [state, setState] = useState<T | undefined>();
  useEffect(() => {
    (async () => {
      setState(await func());
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
