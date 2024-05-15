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
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
  },
});

export const { addTransaction, setTransactions } = transactionsSlice.actions;

const store = configureStore({
  reducer: {
    transactions: transactionsSlice.reducer,
  },
});

export default store;


