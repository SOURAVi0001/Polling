import { createSlice } from '@reduxjs/toolkit';

const initialState = {
      name: null,
      role: null,
      studentsList: []
};

const studentSlice = createSlice({
      name: 'student',
      initialState,
      reducers: {
            setUser(state, action) {
                  state.name = action.payload.name;
                  state.role = action.payload.role;
            },
            clearUser(state) {
                  state.name = null;
                  state.role = null;
            },
            setStudentsList(state, action) {
                  state.studentsList = action.payload;
            }
      }
});

export const { setUser, clearUser, setStudentsList } = studentSlice.actions;
export default studentSlice.reducer;
