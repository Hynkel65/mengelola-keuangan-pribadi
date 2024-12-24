export const getMonthlyReport = (incomes, expenses, month, year) => {
    const monthlyIncomes = incomes.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getMonth() === month && incomeDate.getFullYear() === year;
    });

    const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
    });

    const totalIncome = monthlyIncomes.reduce((total, income) => total + income.amount, 0);
    const totalExpense = monthlyExpenses.reduce((total, expense) => total + expense.amount, 0);
    const balance = totalIncome - totalExpense;

    return {
        totalIncome,
        totalExpense,
        balance,
    };
};

export const getAnnualReport = (incomes, expenses, year) => {
    const annualData = Array.from({ length: 12 }, (_, index) => {
        const monthData = getMonthlyReport(incomes, expenses, index, year);
        return {
            month: index + 1,
            totalIncome: monthData.totalIncome,
            totalExpense: monthData.totalExpense,
            balance: monthData.balance,
        };
    });
    return {
        annualData
    };
};

export const getCategoryReport = (expenses) => {
    const categoryData = {};

    expenses.forEach(expense => {
        const category = expense.category;
        if (!categoryData[category]) {
            categoryData[category] = 0;
        }
        categoryData[category] += expense.amount;
    });

    return categoryData;
};