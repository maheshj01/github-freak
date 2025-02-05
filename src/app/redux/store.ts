import { configureStore } from '@reduxjs/toolkit';
import { legendReducer } from './reducers/legendSlice';

export const store = configureStore({
    reducer: {
        legend: legendReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
