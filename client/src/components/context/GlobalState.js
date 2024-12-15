import React, { createContext, useReducer, useEffect } from 'react';
import AppReducer from './AppReducer';
import axios from 'axios';

// Initial state
const initialState = {
  incomes: [],
  expenses: [],
  error: null,
  isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated')) || false,
  user: JSON.parse(localStorage.getItem('user')) || null,
};

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  const signin = async (userData) => {
    try {
      const res = await axios.post('/api/v1/users/signin', userData);
      console.log('Sign-in response:', res.data); // Log the response
      dispatch({ type: 'SIGN_IN_SUCCESS', payload: res.data.user });
      localStorage.setItem('user', JSON.stringify(res.data.user));
      console.log('User  signed in:', res.data.user); // Log the user data
      return true;
    } catch (error) {
      console.error('Sign-in error:', error.response?.data?.message); // Log any error messages
      dispatch({ type: 'AUTH_ERROR', payload: error.response?.data?.message });
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      const res = await axios.post('/api/v1/users/signup', userData);
      dispatch({ type: 'SIGN_UP_SUCCESS', payload: res.data.user });
      return true;
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error.response?.data?.message });
      return false;
    }
  };

  const signout = async () => {
    try {
      await axios.post('/api/v1/users/signout'); // Call the signout API
      dispatch({ type: 'SIGN_OUT' }); // Dispatch the SIGN_OUT action
      localStorage.removeItem('isAuthenticated'); // Remove isAuthenticated from local storage
      localStorage.removeItem('user'); // Remove user from local storage
      return true;
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error.response?.data?.message });
      return false;
    }
  };
  
  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated));
    localStorage.setItem('user', JSON.stringify(state.user));
  }, [state.isAuthenticated, state.user]);
  

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await axios.get('/api/v1/users/check-auth',{
          withCredentials: true,
        });
        console.log('Check auth response:', res.data);
        if (res.data.isAuthenticated) {
          dispatch({ 
            type: 'SIGN_IN_SUCCESS', 
            payload: res.data.user 
          });
        }
      } catch (error) {
        dispatch({ type: 'AUTH_ERROR' });
      }
    };
    
    checkAuthStatus();
  }, []);

  // Actions
  // Fetch data from the backend and update state for incomes
  const getIncomes = async () => {
    try {
      const res = await axios.get('/api/v1/incomes');
      console.log('Fetched incomes:', res.data.data);
      dispatch({ type: 'GET_INCOMES', payload: res.data.data });
    } catch (error) {
      console.error('Error fetching incomes:', error.response?.data?.error);
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
      console.log('Added new income:', res.data.data);
      dispatch({ type: 'ADD_INCOME', payload: res.data.data });
    } catch (error) {
      console.error('Error adding income:', error.response?.data?.error);
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
    if (state.isAuthenticated) {
      getIncomes();
      getExpenses();
    }
  }, [state.isAuthenticated]);

  return (
    <GlobalContext.Provider
      value={{
        incomes: state.incomes,
        expenses: state.expenses,
        error: state.error,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        signin,
        signup,
        signout,
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
