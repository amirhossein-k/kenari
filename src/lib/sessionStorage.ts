// src\lib\sessionStorage.ts
import type { WebStorage } from 'redux-persist';

const createSessionStorage = (): WebStorage => {
  return {
    getItem: (key) => Promise.resolve(sessionStorage.getItem(key)),
    setItem: (key, item) => {
      sessionStorage.setItem(key, item);
      return Promise.resolve();
    },
    removeItem: (key) => {
      sessionStorage.removeItem(key);
      return Promise.resolve();
    },
  };
};

export const sessionStorageWrapper = createSessionStorage();
