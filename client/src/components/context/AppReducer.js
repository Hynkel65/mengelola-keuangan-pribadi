const AppReducer = (state, action) => {
  switch (action.type) {
    case 'SIGN_IN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        error: null
      };

    case 'SIGN_UP_SUCCESS':
      return {
        ...state,
        user: action.payload,
        error: null
      };

    case 'AUTH_ERROR':
      return {
        ...state,
        error: action.payload
      };

    case 'SIGN_OUT':
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        incomes: [],
        expenses: [],
        budgets: [],
      };

    case 'GET_BUDGETS':
      return {
        ...state,
        budgets: action.payload,
        error: null
      };

    case 'ADD_BUDGET':
      return {
        ...state,
        budgets: [...state.budgets, action.payload],
        error: null
      };

    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(budget =>
          budget._id === action.payload._id ? action.payload : budget
        ),
        error: null
      };

    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(budget => budget._id !== action.payload),
        error: null
      };

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