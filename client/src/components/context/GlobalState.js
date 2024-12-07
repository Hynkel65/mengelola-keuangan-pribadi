import React, { createContext, useReducer, useEffect } from 'react';
import AppReducer from './AppReducer';
import axios from 'axios';

// Initial state
const initialState = {
  incomes: [],
  expenses: [],
  error: null,
};

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions
  // Fetch data from the backend and update state for incomes
  const getIncomes = async () => {
    try {
      const res = await axios.get('/api/v1/incomes');
      dispatch({ type: 'GET_INCOMES', payload: res.data.data });
    } catch (error) {
      dispatch({ type: 'TRANSACTION_ERROR', payload: error.response.data.error });
    }
  };

  // Fetch data from the backend and update state for expenses
  const getExpenses = async () => {
    try {
      const res = await axios.get('/api/v1/expenses');
      dispatch({ type: 'GET_EXPENSES', payload: res.data.data });
    } catch (error) {
      dispatch({ type: 'TRANSACTION_ERROR', payload: error.response.data.error });
    }
  };

  // Action to add income
  const addIncome = async (incomeData) => {
    try {
      const res = await axios.post('/api/v1/incomes', incomeData);
      dispatch({ type: 'ADD_INCOME', payload: res.data.data });
    } catch (error) {
      dispatch({ type: 'TRANSACTION_ERROR', payload: error.response.data.error });
    }
  };

  // Action to add expense
  const addExpense = async (expenseData) => {
    try {
      const res = await axios.post('/api/v1/expenses', expenseData);
      dispatch({ type: 'ADD_EXPENSE', payload: res.data.data });
    } catch (error) {
      dispatch({ type: 'TRANSACTION_ERROR', payload: error.response.data.error });
    }
  };

  // Action to delete income
  const deleteIncome = async (id) => {
    try {
      await axios.delete(`/api/v1/incomes/${id}`);
      dispatch({ type: 'DELETE_INCOME', payload: id });
    } catch (error) {
      dispatch({ type: 'TRANSACTION_ERROR', payload: error.response.data.error });
    }
  };

  // Action to delete expense
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`/api/v1/expenses/${id}`);
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    } catch (error) {
      dispatch({ type: 'TRANSACTION_ERROR', payload: error.response.data.error });
    }
  };

  // Action to update income
  const updateIncome = async (id, incomeData) => {
    try {
      const res = await axios.patch(`/api/v1/incomes/${id}`, incomeData);
      dispatch({ type: 'UPDATE_INCOME', payload: res.data.data });
    } catch (error) {
      dispatch({ type: 'TRANSACTION_ERROR', payload: error.response.data.error });
    }
  };

  // Action to update expense
  const updateExpense = async (id, expenseData) => {
    try {
      const res = await axios.patch(`/api/v1/expenses/${id}`, expenseData);
      dispatch({ type: 'UPDATE_EXPENSE', payload: res.data.data });
    } catch (error) {
      dispatch({ type: 'TRANSACTION_ERROR', payload: error.response.data.error });
    }
  };

  useEffect(() => {
    getIncomes();
    getExpenses();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        incomes: state.incomes,
        expenses: state.expenses,
        error: state.error,
        getIncomes,
        getExpenses,
        addIncome,
        addExpense,
        deleteIncome,
        deleteExpense,
        updateIncome,
        updateExpense,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
