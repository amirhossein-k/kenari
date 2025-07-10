
// src/store/index.ts
import { configureStore} from '@reduxjs/toolkit'
import productReducer from './productSlice'
import navReducer from './navbarSlice'

export const store = configureStore({
    reducer:{
        products:productReducer,
        navnar: navReducer,
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch