import React, { useEffect, useContext, useState } from 'react';
import Form from '../layout/Form';
import moneyFormatter from '../utils/MoneyFormatter';
import DeleteConfirmationModal from '../utils/DeleteConfirmationModal';
import ImageModal from '../utils/ImageModal';
import '../style/Expense.css';
import { GlobalContext } from '../context/GlobalState';

const Expense = ({ selectedExpense, setSelectedExpense }) => {
  // Global context for managing expenses
  const { expenses, addExpense, deleteExpense, updateExpense } = useContext(GlobalContext);

  // State variables
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [formMode, setFormMode] = useState("add");
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formValues, setFormValues] = useState({
    title: '',
    amount: '',
    date: '',
    category: '',
    description: '',
    image: null,
  });

  // Handle image click to show in modal
  const handleImgClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  // Effect hook to update form values when a selected expense changes
  useEffect(() => {
    if (selectedExpense) {
      setFormMode("update");
      setFormValues({
        title: selectedExpense.title,
        amount: selectedExpense.amount,
        date: new Date(selectedExpense.date).toISOString().split('T')[0],
        category: selectedExpense.category,
        description: selectedExpense.description,
        image: selectedExpense.image ? `/uploads/${selectedExpense.image}` : null,
      });
    }
  }, [selectedExpense]);

  // Handle form submission for adding a new expense
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formattedDate = new Date(formValues.date);

    try {
      const formData = new FormData();
      formData.append('title', formValues.title);
      formData.append('amount', formValues.amount);
      formData.append('date', formattedDate.toISOString());
      formData.append('category', formValues.category);
      formData.append('description', formValues.description);
      formData.append('image', formValues.image);

      await addExpense(formData);
      resetFormValues();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
    setSelectedImage(null);
  };

  // Handle input changes in the form
  const handleInputChange = (event) => {
    const { name, value, type, files } = event.target;
    setFormValues({
      ...formValues,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  // Handle editing an existing expense
  const handleEditExpense = (expense) => {
    setFormMode("update");
    setSelectedExpense(expense);
    setFormValues({
      title: expense.title,
      amount: expense.amount,
      date: new Date(expense.date).toISOString().split('T')[0],
      category: expense.category,
      description: expense.description,
      image: expense.image ? `/uploads/${expense.image}` : null,
    });
  };

  // Handle updating an existing expense
  const handleUpdateExpense = async (event) => {
    event.preventDefault();
    if (!selectedExpense) {
      console.error('No expense selected for update');
      return;
    }

    try {
      const formattedDate = new Date(formValues.date);
      const updatedFormData = {
        title: formValues.title,
        amount: formValues.amount,
        date: formattedDate.toISOString(),
        category: formValues.category,
        description: formValues.description,
        image: formValues.image,
      };

      await updateExpense(selectedExpense._id, updatedFormData);
      resetFormValues();
      setFormMode("add");
      setSelectedExpense(null);
      alert('Expense data has been successfully updated.');
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('Failed to update expense. Please try again.');
    }
  };

  // Function to reset form values
  const resetFormValues = () => {
    setFormValues({
      title: '',
      amount: '',
      date: '',
      category: '',
      description: '',
      image: null,
    });
  };

  // Get recent expenses and calculate the total expense for the current month
  const recentExpenseData = expenses.slice(-4).reverse();
  const currentDate = new Date();
  const totalExpense = expenses.reduce((total, expense) => {
    const expenseDate = new Date(expense.date);
    return (expenseDate.getMonth() === currentDate.getMonth() &&
      expenseDate.getFullYear() === currentDate.getFullYear())
      ? total + parseFloat(expense.amount)
      : total;
  }, 0);

// Expense category options
const expenseOptions = [
  { value: 'basic_needs', label: 'Kebutuhan Pokok' },
  { value: 'education', label: 'Pendidikan' },
  { value: 'entertainment', label: 'Hiburan' },
  { value: 'social', label: 'Sosial' },
  { value: 'finance', label: 'Keuangan' },
  { value: 'unexpected_expenses', label: 'Pengeluaran Tidak Terduga' },
];

  return (
    <div className="expense-con">
      <h1>Pengeluaran</h1>
      <div className="total-expense-con">
        <h2>Pengeluaran Bulan Ini</h2>
        <h3 className="total-expense-text">{moneyFormatter(totalExpense)}</h3>
      </div>
      <div className="main-content">
        <div className="left-content">
          <Form
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            handleUpdate={handleUpdateExpense}
            formData={formValues}
            categoryOptions={expenseOptions}
            categoryType="expense"
            formMode={formMode}
            selectedData={selectedExpense}
          />
        </div>
        <div className="right-content">
          <h3>Pengeluaran Terkini</h3>
          {recentExpenseData.map((expense) => (
            <div key={expense._id} className="history-item-con">
              <div className="history-item-details">
                <div className="img-con" onClick={() => handleImgClick(expense.image)}>
                  {expense.image && (
                    <img src={`/uploads/${expense.image}`} alt="Expense" />
                  )}
                </div>
                <div className="info">
                  <div className="history-title">{expense.title}</div>
                  <div className="history-info">
                    <span className="amount">{moneyFormatter(expense.amount)}</span>
                    <span className="date">
                      {new Date(expense.date).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="category">{expense.category}</span>
                  </div>
                </div>
                <div className="edit">
                  <button className="edit-btn" onClick={() => handleEditExpense(expense)}>
                    EDIT
                  </button>
                </div>
                <div className="delete">
                  <button className="delete-btn" onClick={() => {
                    setExpenseToDelete(expense);
                    setShowDeleteConfirmation(true);
                  }}>X</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showModal && <ImageModal image={selectedImage} closeModal={() => setShowModal(false)} />}
      <DeleteConfirmationModal
        show={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onDelete={() => {
          if (expenseToDelete) {
            deleteExpense(expenseToDelete._id);
            setExpenseToDelete(null);
            setShowDeleteConfirmation(false);
          }
        }}
      />
    </div>
  );
};

export default Expense;