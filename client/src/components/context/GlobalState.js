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
  const updateIncome = async (id, updatedIncomeData) => {
    try {
      const response = await fetch(`/api/v1/incomes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedIncomeData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update income: ${response.status} ${response.statusText}`);
      }
  
      const updatedIncome = await response.json();
      dispatch({ type: 'UPDATE_INCOME', payload: updatedIncome.data });
      return updatedIncome;
    } catch (error) {
      console.error('Error updating income:', error);
      throw error;
    }
  };

  // Action to update expense
  const updateExpense = async (id, updatedExpenseData) => {
    try {
      const response = await fetch(`/api/v1/expenses/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedExpenseData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update expense: ${response.status} ${response.statusText}`);
      }
  
      const updatedExpense = await response.json();
      dispatch({ type: 'UPDATE_EXPENSE', payload: updatedExpense.data });
      return updatedExpense;
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
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
