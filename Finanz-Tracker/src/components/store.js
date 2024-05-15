import { configureStore, createSlice } from '@reduxjs/toolkit';

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: [],
  },
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
    },
  },
});

export const { addTransaction } = transactionsSlice.actions;

const store = configureStore({
  reducer: {
    transactions: transactionsSlice.reducer,
  },
});

export default store;
