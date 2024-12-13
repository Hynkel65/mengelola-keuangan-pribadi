import React, { useEffect, useContext, useState } from 'react';
import Form from '../layout/Form';
import moneyFormatter from '../utils/MoneyFormatter';
import DeleteConfirmationModal from '../utils/DeleteConfirmationModal';
import ImageModal from '../utils/ImageModal';

import '../style/Income.css'
import { GlobalContext } from '../../context/GlobalState';

const Income = ({ getFileInputRef, selectedIncome, setSelectedIncome }) => {
  const { incomes, addIncome, deleteIncome, updateIncome } = useContext(GlobalContext);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState(null);

  const [formMode, setFormMode] = useState("add");

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
    image: null
  });

  useEffect(() => {
    if (selectedIncome) {
      setFormMode("update");
      setFormValues({
        title: selectedIncome.title,
        amount: selectedIncome.amount,
        date: new Date(selectedIncome.date).toISOString().split('T')[0],
        category: selectedIncome.category,
        description: selectedIncome.description,
        image: selectedIncome.image ? `/uploads/${selectedIncome.image}` : null,
      });
    }
  }, [selectedIncome]);

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
  
      await addIncome(formData);

      // Clear the values
      setFormValues({
        title: '',
        amount: '',
        date: '',
        category: '',
        description: '',
        image: null
      });

      const fileInputRef = getFileInputRef(); // Get the fileInputRef from the Form component

      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the file input value
      }
    } catch (error) {
      console.error('Error adding income:', error);
    }

    setSelectedImage(null);
  };

  const handleInputChange = (event) => {
    const { name, value, type, files } = event.target;
  
    if (type === 'file') {
      setFormValues({
        ...formValues,
        image: files[0],
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  const handleEditIncome = (income) => {
    setFormMode("update");
    setSelectedIncome(income);
    setFormValues({
      title: income.title,
      amount: income.amount,
      date: new Date(income.date).toISOString().split('T')[0],
      category: income.category,
      description: income.description,
      image: income.image ? `/uploads/${income.image}` : null
    });
  };

  const handleUpdateIncome = async (event) => {
    event.preventDefault();
    if (selectedIncome) {
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
  
        await updateIncome(selectedIncome._id, updatedFormData);
  
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
        setSelectedIncome(null);

        alert('Income data has been successfully updated.');

      } catch (error) {
        console.error('Error updating income:', error);
        alert('Failed to update income. Please try again.');
      }
    } else {
      console.error('No income selected for update');
    }
  };

  const recentIncomeData = incomes.slice(-4).reverse();

  // Define the category options for Income
  const incomeOptions = [
    { value: 'salary', label: 'Salary' },
    { value: 'freelancing', label: 'Freelancing' },
    { value: 'investments', label: 'Investments' },
    { value: 'stocks', label: 'Stocks' },
    { value: 'bitcoin', label: 'Bitcoin' },
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'youtube', label: 'Youtube' },
    { value: 'other', label: 'Other' },
  ];

  const currentDate = new Date();
  const totalIncome = incomes.reduce((total, income) => {
    const incomeDate = new Date(income.date);
    if (incomeDate.getMonth() === currentDate.getMonth() && 
        incomeDate.getFullYear() === currentDate.getFullYear()) {
      return total + parseFloat(income.amount);
    }
    return total;
  }, 0);

  return (
    <div className="income-con">
      <h2 className="income-heading">INCOME</h2>
      <div className="total-income-con">
        <p className="total-income-text">{moneyFormatter(totalIncome)}</p>
      </div>
      <div className="main-content">
        <div className="left-content">
        <Form 
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          handleUpdate={handleUpdateIncome}
          formData={formValues} 
          categoryOptions={incomeOptions}
          categoryType="income"
          formMode={formMode}
          selectedData={selectedIncome}
        />
        </div>
        <div className="right-content">
          <h3 className="history-heading">Recent Incomes</h3>
          {recentIncomeData.map((income) => (
            <div key={income._id} className="history-item-con">
              <div className="history-item-details">
                <div className="img-con" onClick={() => handleImgClick(income.image)}>
                  {income.image && (
                    <img src={`/uploads/${income.image}`} alt="Income"/>
                  )}
                </div>
                <div className="info">
                  <div className="history-title">{income.title}</div>
                  <div className="history-info">
                    <span className="amount">{moneyFormatter(income.amount)}</span>
                    <span className="date">
                      {new Date(income.date).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="category">{income.category}</span>
                  </div>
                </div>
                <div className="edit">
                  <span className="edit-btn" onClick={() => handleEditIncome(income)}>EDIT</span>
                </div>
                <div className="delete">
                  <span className="delete-btn" onClick={() => {
                    setIncomeToDelete(income);
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
          if (incomeToDelete) {
            deleteIncome(incomeToDelete._id);
            setIncomeToDelete(null);
            setShowDeleteConfirmation(false);
          }
        }}
      />
    </div>
  );
};

export default Income;