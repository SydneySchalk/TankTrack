import { useEffect, useState } from 'react';
import { subscribe } from './api.js';

// loads data from api.js and reloads it when something changes
// ex: const tanks = useData(getTanks)
export function useData(loader, ...args) {
  const [data, setData] = useState(undefined);
  const key = JSON.stringify(args);

  useEffect(() => {
    let active = true;
    const run = () => loader(...args).then((d) => active && setData(d));
    run();
    const unsubscribe = subscribe(run);
    return () => {
      active = false;
      unsubscribe();
    };
  }, [loader, key]);

  return data;
}
