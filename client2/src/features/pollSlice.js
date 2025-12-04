import { createSlice } from '@reduxjs/toolkit';

const initialState = {
      active: null,
      past: []
};

const pollSlice = createSlice({
      name: 'poll',
      initialState,
      reducers: {
            setActive(state, action) {
                  state.active = action.payload;
            },
            clearActive(state) {
                  state.active = null;
            },
            setPastPolls(state, action) {
                  state.past = action.payload;
            }
      }
});

export const { setActive, clearActive, setPastPolls } = pollSlice.actions;
export default pollSlice.reducer;
