
// src/store/index.ts
import { combineReducers, configureStore} from '@reduxjs/toolkit'
import productReducer from './productSlice'
import navReducer from './navbarSlice'
import {  persistReducer, persistStore } from 'redux-persist';
import storage from './storage'; // به جای createWebStorage



const persistConfig = {
  key: 'root',
  storage,
};


// ترکیب همه ریدوسرها
const rootReducer = combineReducers({
  products: productReducer,
  navbar: navReducer, // اصلاح نام
});

// اضافه کردن persist به ریدوسر اصلی
const persistedReducer = persistReducer(persistConfig, rootReducer);


// ساختن store با ریدوسر پِرسیست‌شده
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // برای رفع اخطار مربوط به redux-persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch