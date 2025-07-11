// src/utils/storage.ts
import type { Storage } from 'redux-persist';
/* eslint-disable @typescript-eslint/no-unused-vars */

const createNoopStorage = (): Storage => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

// استفاده از storage فقط در محیط مرورگر (حل مشکل SSR)
let storage: Storage;

if (typeof window !== 'undefined') {
  // اینجا import sync قانونی است چون فقط در مرورگر اجرا می‌شود
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
  storage = require('redux-persist/lib/storage').default;
} else {
  storage = createNoopStorage();
}

export default storage;
