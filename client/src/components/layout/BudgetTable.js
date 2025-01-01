import React, { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import moneyFormatter from '../utils/MoneyFormatter';
import DeleteConfirmationModal from '../utils/DeleteConfirmationModal';

const BudgetTable = () => {
    const { budgets, addBudget, updateBudget, deleteBudget } = useContext(GlobalContext);
    const [editMode, setEditMode] = useState(null);
    const [budgetAmount, setBudgetAmount] = useState('');
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [budgetToDelete, setBudgetToDelete] = useState(null);

    const expenseCategories = [
        { value: 'basic_needs', label: 'Kebutuhan Pokok' },
        { value: 'education', label: 'Pendidikan' },
        { value: 'health', label: 'Kesehatan' },
        { value: 'entertainment', label: 'Hiburan' },
        { value: 'social', label: 'Sosial' },
        { value: 'finance', label: 'Keuangan' },
        { value: 'unexpected_expenses', label: 'Pengeluaran Tidak Terduga' }
    ];

    const handleAddBudget = async (category) => {
        try {
            await addBudget({
                category: category.value,
                amount: parseFloat(budgetAmount),
            });
            setBudgetAmount('');
            setEditMode(null);
        } catch (error) {
            console.error('Error adding budget:', error);
        }
    };

    const handleUpdateBudget = async (budgetId, amount, category) => {
        try {
            await updateBudget(budgetId, {
                amount: parseFloat(amount),
                category: category,
            });
            setEditMode(null);
            alert('Data anggaran berhasil diperbarui.');
        } catch (error) {
            console.error('Error updating budget:', error);
            alert('Gagal memperbarui data anggaran. Silakan coba lagi.');
        }
    };

    return (
        <div>
            <table className="budget-table">
                <thead>
                    <tr>
                        <th>Kategori</th>
                        <th>Budget</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {expenseCategories.map((category) => {
                        const existingBudget = budgets.find(b => b.category === category.value);

                        return (
                            <tr key={category.value}>
                                <td>{category.label}</td>
                                <td>
                                    {editMode === category.value ? (
                                        <input
                                            type="number"
                                            value={budgetAmount}
                                            onChange={(e) => setBudgetAmount(e.target.value)}
                                        />
                                    ) : (
                                        existingBudget ? moneyFormatter(existingBudget.amount) : '-'
                                    )}
                                </td>
                                <td>
                                    {existingBudget ? (
                                        <>
                                            {editMode === category.value ? (
                                                <button onClick={() => handleUpdateBudget(existingBudget._id, budgetAmount, category.value)}>
                                                    Simpan
                                                </button>
                                            ) : (
                                                <>
                                                    <button onClick={() => {
                                                        setEditMode(category.value);
                                                        setBudgetAmount(existingBudget.amount);
                                                    }}>
                                                        Edit
                                                    </button>
                                                <button onClick={() => {
                                                    setBudgetToDelete(existingBudget);
                                                    setShowDeleteConfirmation(true);
                                                }}>
                                                    Hapus
                                                </button>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {editMode === category.value ? (
                                                <button onClick={() => handleAddBudget(category)}>
                                                    Tambah
                                                </button>
                                            ) : (
                                                <button onClick={() => setEditMode(category.value)}>
                                                    Tentukan Anggaran
                                                </button>
                                            )}
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <DeleteConfirmationModal
                show={showDeleteConfirmation}
                onClose={() => setShowDeleteConfirmation(false)}
                onDelete={() => {
                    if (budgetToDelete) {
                        deleteBudget(budgetToDelete._id);
                        setBudgetToDelete(null);
                        setShowDeleteConfirmation(false);
                    }
                }}
            />
        </div>
    );
};

export default BudgetTable;