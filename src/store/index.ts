import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import businessReducer from './businessSlice';
import expenseReducer from './expenseSlice';
import leaveReducer from './leaveSlice';

export const store = configureStore({
  reducer: {
    business: businessReducer,
    expense: expenseReducer,
    leave: leaveReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
