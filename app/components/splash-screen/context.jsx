import { createContext, useContext } from 'react';

export const SplashContext = createContext(true);

export function useSplashDone() {
  return useContext(SplashContext);
}
