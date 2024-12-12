import React, { useContext, useState } from 'react';
import Form from '../layout/Form';
import moneyFormatter from '../utils/MoneyFormatter';
import DeleteConfirmationModal from '../utils/DeleteConfirmationModal'
import ImageModal from '../utils/ImageModal';

import '../style/Expense.css'
import { GlobalContext } from '../../context/GlobalState';

const Expense = () => {
  const { expenses, addExpense, deleteExpense, updateExpense } = useContext(GlobalContext);
  
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const [formMode, setFormMode] = useState("add");
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImgClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  // Placeholder data and state for the form
  const [formValues, setFormValues] = useState({
    title: '',
    amount: '',
    date: '',
    category: '',
    description: '',
  });

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
      formData.append('image', formValues.image); // Append the File object
  
      await addExpense(formData); // Send the FormData object

      setFormValues({
        title: '',
        amount: '',
        date: '',
        category: '',
        description: '',
        image: null
      });
    } catch (error) {
      console.error('Error adding expense:', error)
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, files } = event.target;

    if (type === 'file') {
      setFormValues({
        ...formValues,
        [name]: files[0], // Store the File object
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  const handleEditExpense = (expense) => {
    setFormMode("update");
    setSelectedExpense(expense);
    setFormValues({
      title: expense.title,
      amount: expense.amount,
      date: new Date(expense.date).toISOString().split('T')[0],
      category: expense.category,
      description: expense.description,
      image: expense.image ? `/uploads/${expense.image}` : null
    })
  }

  const handleUpdateExpense = async (event) => {
    event.preventDefault();
    if (selectedExpense) {
      try {
        const formattedDate = new Date(formValues.date);
        let updatedFormData = {
          title: formValues.title,
          amount: formValues.amount,
          date: formattedDate.toISOString(),
          category: formValues.category,
          description: formValues.description,
        };
  
        if (formValues.image) {
          updatedFormData.image = formValues.image;
        }
  
        await updateExpense(selectedExpense._id, updatedFormData);
  
        // Reset form
        setFormValues({
          title: '',
          amount: '',
          date: '',
          category: '',
          description: '',
          image: null,
        });
  
        setFormMode("add");
        setSelectedExpense(null);

        alert('Expense data has been successfully updated.');

      } catch (error) {
        console.error('Error updating expense:', error);
        alert('Failed to update expense. Please try again.');
      }
    } else {
      console.error('No expense selected for update');
    }
  };

  const recentExpenseData = expenses.slice(-4);

  // Define the category options for expense
  const expenseOptions = [
    { value: 'education', label: 'Education' },
    { value: 'groceries', label: 'Groceries' },
    { value: 'health', label: 'Health' },
    { value: 'subscriptions', label: 'Subscriptions' },
    { value: 'takeaways', label: 'Takeaways' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'traveling', label: 'Taveling' },
    { value: 'others', label: 'Others' },
  ];

  const totalExpense = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);

  return (
    <div className="expense-con">
      <h2 className="expense-heading">EXPENSE</h2>
      <div className="total-expense-con">
        <p className="total-expense-text">{moneyFormatter(totalExpense)}</p>
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
          <h3 className="history-heading">Recent Expenses</h3>
          {recentExpenseData.map((expense) => (
            <div key={expense._id} className="history-item-con">
              <div className="history-item-details">
              <div className="img-con" onClick={() => handleImgClick(expense.image)}>
                {expense.image && (
                  <img src={`/uploads/${expense.image}`} alt="Expense" class="center"/>
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
                    <span className="description">{expense.description}</span>
                  </div>
                </div>
                <div className="edit">
                  <span className="edit-btn" onClick={() => handleEditExpense(expense)}>EDIT</span>
                </div>
                <div className="delete">
                  <span className="delete-btn" onClick={() => {
                    setExpenseToDelete(expense);
                    setShowDeleteConfirmation(true);
                  }}>X</span>
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