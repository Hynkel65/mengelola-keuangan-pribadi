// src/components/context/AppReducer.js
const AppReducer = (state, action) => {
  switch (action.type) {
    case 'GET_INCOMES':
      return {
        ...state,
        incomes: action.payload,
        error: null,
      };
    case 'GET_EXPENSES':
      return {
        ...state,
        expenses: action.payload,
        error: null,
      };
    case 'ADD_INCOME':
      return {
        ...state,
        incomes: [...state.incomes, action.payload],
        error: null,
      };
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
        error: null,
      };
    case 'DELETE_INCOME':
      return {
        ...state,
        incomes: state.incomes.filter((income) => income._id !== action.payload),
        error: null,
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense._id !== action.payload),
        error: null,
      };
    case 'UPDATE_INCOME':
      return {
        ...state,
        incomes: state.incomes.map((income) =>
          income._id === action.payload._id ? action.payload : income
        ),
        error: null,
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense._id === action.payload._id ? action.payload : expense
        ),
        error: null,
      };
    case 'TRANSACTION_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default AppReducer;
