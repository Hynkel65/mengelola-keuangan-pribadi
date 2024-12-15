// Reducer function to manage application state based on action types
const AppReducer = (state, action) => {
  switch (action.type) {
    case 'SIGN_IN_SUCCESS':
      // Handle successful sign-in
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        error: null
      };

    case 'SIGN_UP_SUCCESS':
      // Handle successful sign-up
      return {
        ...state,
        user: action.payload,
        error: null
      };

    case 'AUTH_ERROR':
      // Handle authentication error
      return {
        ...state,
        error: action.payload
      };

    case 'SIGN_OUT':
      // Handle sign-out and clear user data from local storage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        incomes: [],
        expenses: []
      };

    case 'GET_INCOMES':
      // Handle fetching of incomes
      return {
        ...state,
        incomes: action.payload,
        error: null,
      };

    case 'GET_EXPENSES':
      // Handle fetching of expenses
      return {
        ...state,
        expenses: action.payload,
        error: null,
      };

    case 'ADD_INCOME':
      // Handle adding a new income
      return {
        ...state,
        incomes: [...state.incomes, action.payload],
        error: null,
      };

    case 'ADD_EXPENSE':
      // Handle adding a new expense
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
        error: null,
      };

    case 'DELETE_INCOME':
      // Handle deletion of an income
      return {
        ...state,
        incomes: state.incomes.filter((income) => income._id !== action.payload),
        error: null,
      };

    case 'DELETE_EXPENSE':
      // Handle deletion of an expense
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense._id !== action.payload),
        error: null,
      };

    case 'UPDATE_INCOME':
      // Handle updating an income
      return {
        ...state,
        incomes: state.incomes.map((income) =>
          income._id === action.payload._id ? action.payload : income
        ),
        error: null,
      };

    case 'UPDATE_EXPENSE':
      // Handle updating an expense
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense._id === action.payload._id ? action.payload : expense
        ),
        error: null,
      };

    case 'TRANSACTION_ERROR':
      // Handle transaction error
      return {
        ...state,
        error: action.payload,
      };

    default:
      // Return current state if action type is not recognized
      return state;
  }
};

export default AppReducer;