import { createSlice } from "@reduxjs/toolkit";

const transactionsSlice = createSlice({
  name: "transactions",
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
export default transactionsSlice.reducer;
