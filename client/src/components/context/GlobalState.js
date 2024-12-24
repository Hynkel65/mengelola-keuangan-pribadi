import React, { createContext, useReducer, useEffect } from 'react';
import AppReducer from './AppReducer';
import axios from 'axios';

const initialState = {
  incomes: [],
  expenses: [],
  budgets: [],
  error: null,
  isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated')) || false,
  user: JSON.parse(localStorage.getItem('user')) || null,
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Sign in a user
  const signin = async (userData) => {
    try {
      const res = await axios.post('/api/v1/users/signin', userData);
      dispatch({ type: 'SIGN_IN_SUCCESS', payload: res.data.user });
      localStorage.setItem('user', JSON.stringify(res.data.user));
      return true;
    } catch (error) {
      console.error('Sign-in error:', error.response?.data?.message);
      dispatch({ type: 'AUTH_ERROR', payload: error.response?.data?.message });
      return false;
    }
  };

  // Sign up a new user
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

  // Sign out the current user
  const signout = async () => {
    try {
      await axios.post('/api/v1/users/signout');
      dispatch({ type: 'SIGN_OUT' });
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      return true;
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error.response?.data?.message });
      return false;
    }
  };

  // Store authentication status and user in local storage
  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated));
    localStorage.setItem('user', JSON.stringify(state.user));
  }, [state.isAuthenticated, state.user]);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await axios.get('/api/v1/users/check-auth', {
          withCredentials: true,
        });
        if (res.data.isAuthenticated) {
          dispatch({
            type: 'SIGN_IN_SUCCESS',
            payload: res.data.user,
          });
        }
      } catch (error) {
        dispatch({ type: 'AUTH_ERROR' });
      }
    };
    checkAuthStatus();
  }, []);

  // Fetch budgets from the server
  const getBudgets = async () => {
    try {
      const res = await axios.get('/api/v1/budgets');
      dispatch({ type: 'GET_BUDGETS', payload: res.data.data });
    } catch (error) {
      console.error('Error fetching budgets:', error.response?.data?.error);
      dispatch({ type: 'TRANSACTION_ERROR', payload: error.response.data.error });
    }
  };

  // Add a new budget
  const addBudget = async (budgetData) => {
    try {
      const res = await axios.post('/api/v1/budgets', budgetData);
      dispatch({ type: 'ADD_BUDGET', payload: res.data.data });
    } catch (error) {
      console.error('Error adding budget:', error.response?.data?.error);
      dispatch({ type: 'TRANSACTION_ERROR', payload: error.response.data.error });
    }
  };

  // Update a budget by ID
  const updateBudget = async (id, updatedBudgetData) => {
    try {
      const response = await axios.patch(`/api/v1/budgets/${id}`, updatedBudgetData);
      dispatch({ type: 'UPDATE_BUDGET', payload: response.data.data });
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  };

  // Delete a budget by ID
  const deleteBudget = async (id) => {
    try {
      await axios.delete(`/api/v1/budgets/${id}`);
      dispatch({ type: 'DELETE_BUDGET', payload: id });
    } catch (error) {
      console.error('Error deleting budget:', error.response.data.error);
      dispatch({ type: 'TRANSACTION_ERROR', payload: error.response.data.error });
    }
  };

  // Fetch budgets if authenticated
  useEffect(() => {
    if (state.isAuthenticated) {
      getBudgets();
    }
  }, [state.isAuthenticated]);

  // Fetch incomes from the server
  const getIncomes = async () => {
    try {
      const res = await axios.get('/api/v1/incomes');
      dispatch({ type: 'GET_INCOMES', payload: res.data.data });
    } catch (error) {
      console.error('Error fetching incomes:', error.response?.data?.error);
      dispatch({ type: 'TRANSACTION_ERROR', payload: error.response.data.error });
    }
  };

  // Fetch expenses from the server
  const getExpenses = async () => {
    try {
      const res = await axios.get('/api/v1/expenses');
      dispatch({ type: 'GET_EXPENSES', payload: res.data.data });
    } catch (error) {
      dispatch({ type: 'TRANSACTION_ERROR', payload: error.response.data.error });
    }
  };

  // Add a new income
  const addIncome = async (incomeData) => {
    try {
      const res = await axios.post('/api/v1/incomes', incomeData);
      dispatch({ type: 'ADD_INCOME', payload: res.data.data });
    } catch (error) {
      console.error('Error adding income:', error.response?.data?.error);
      dispatch({ type: 'TRANSACTION_ERROR', payload: error.response.data.error });
    }
  };

  // Add a new expense
  const addExpense = async (expenseData) => {
    try {
      const res = await axios.post('/api/v1/expenses', expenseData);
      dispatch({ type: 'ADD_EXPENSE', payload: res.data.data });
    } catch (error) {
      dispatch({ type: 'TRANSACTION_ERROR', payload: error.response.data.error });
    }
  };

  // Delete an income by ID
  const deleteIncome = async (id) => {
    try {
      await axios.delete(`/api/v1/incomes/${id}`);
      dispatch({ type: 'DELETE_INCOME', payload: id });
    } catch (error) {
      dispatch({ type: 'TRANSACTION_ERROR', payload: error.response.data.error });
    }
  };

  // Delete an expense by ID
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`/api/v1/expenses/${id}`);
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    } catch (error) {
      dispatch({ type: 'TRANSACTION_ERROR', payload: error.response.data.error });
    }
  };

  // Update an income by ID
  const updateIncome = async (id, updatedIncomeData) => {
    try {
      const formData = new FormData();

      // Append all key-value pairs to the FormData
      for (const key in updatedIncomeData) {
        formData.append(key, updatedIncomeData[key]);
      }

      const response = await fetch(`/api/v1/incomes/${id}`, {
        method: 'PATCH',
        body: formData, // FormData includes content-type automatically
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


  // Update an expense by ID
  const updateExpense = async (id, updatedExpenseData) => {
    try {
      const formData = new FormData();

      // Append all key-value pairs to the FormData
      for (const key in updatedExpenseData) {
        formData.append(key, updatedExpenseData[key]);
      }

      const response = await fetch(`/api/v1/expenses/${id}`, {
        method: 'PATCH',
        body: formData, // FormData includes content-type automatically
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

  // Fetch incomes and expenses if authenticated
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
        budgets: state.budgets,
        error: state.error,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        signin,
        signup,
        signout,
        addBudget,
        updateBudget,
        deleteBudget,
        getBudgets,
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