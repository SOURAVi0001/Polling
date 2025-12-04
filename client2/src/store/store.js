import { configureStore } from '@reduxjs/toolkit';
import pollReducer from '../features/pollSlice';
import studentReducer from '../features/studentSlice';

export const store = configureStore({
      reducer: {
            poll: pollReducer,
            student: studentReducer
      }
});

export default store;
