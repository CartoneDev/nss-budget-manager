import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    MenuItem,
    Select,
    Box,
} from '@mui/material';

const Transactions = () => {
    const [open, setOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [transactionData, setTransactionData] = useState([]);
    const [newTransaction, setNewTransaction] = useState({
        id: '',
        description: '',
        date: '',
        money: '',
        category: '',
        type: '',
    });
    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState(['Category 1', 'Category 2']);
    const [transactionTypes] = useState(['Income', 'Expense']);
    const [editMode, setEditMode] = useState(false);
    const [editTransactionId, setEditTransactionId] = useState(null);

    const handleOpen = () => {
        setOpen(true);
        setEditMode(false);
        setNewTransaction({
            id: '',
            description: '',
            date: '',
            money: '',
            category: '',
            type: '',
        });
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCategoryOpen = () => {
        setCategoryOpen(true);
    };

    const handleCategoryClose = () => {
        setCategoryOpen(false);
    };

    const handleInputChange = (event) => {
        setNewTransaction({
            ...newTransaction,
            [event.target.name]: event.target.value,
        });
    };
    const handleMoneyInput = (event) => {
        event.target.value = event.target.value.replace(/[^0-9.]/g, '');
    };

    const handleCreateTransaction = () => {
        if (editMode && editTransactionId !== null) {
            const updatedData = transactionData.map((transaction) =>
                transaction.id === editTransactionId ? newTransaction : transaction
            );
            setTransactionData(updatedData);
            setEditMode(false);
            setEditTransactionId(null);
        } else {
            setTransactionData([...transactionData, newTransaction]);
        }
        setNewTransaction({
            description: '',
            money: '',
            category: '',
            type: '',
        });
        setOpen(false);
    };

    const handleEditTransaction = (transactionId) => {
        const transaction = transactionData.find(
            (transaction) => transaction.id === transactionId
        );
        if (transaction) {
            setNewTransaction({ ...transaction });
            setOpen(true);
            setEditMode(true);
            setEditTransactionId(transactionId);
        }
    };

    const handleDeleteTransaction = (transactionId) => {
        const updatedData = transactionData.filter(
            (transaction) => transaction.id !== transactionId
        );
        setTransactionData(updatedData);
    };

    const handleCreateCategory = () => {
        setCategories([...categories, newCategory]);
        setNewCategory('');
        setCategoryOpen(false);
    };

    const handleTypeChange = (event) => {
        setNewTransaction({
            ...newTransaction,
            type: event.target.value,
        });
    };

    return (
        <>
            <Button variant="contained" onClick={handleOpen}>
                Add Transaction
            </Button>

            <Button variant="contained" onClick={handleCategoryOpen} sx={{ml:7}}>
                Add Category
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {editMode ? 'Edit Transaction' : 'Create Transaction'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <TextField
                            name="description"
                            label="Description"
                            value={newTransaction.description}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            name="money"
                            label="Money"
                            value={newTransaction.money}
                            onChange={handleInputChange}
                            onInput={handleMoneyInput}
                            fullWidth
                        />
                        <Select
                            name="category"
                            label="Category"
                            value={newTransaction.category}
                            onChange={handleInputChange}
                            fullWidth
                        >
                            {categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                        <Select
                            name="type"
                            label="Type"
                            value={newTransaction.type}
                            onChange={handleTypeChange}
                            fullWidth
                        >
                            {transactionTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleCreateTransaction}>
                        {editMode ? 'Save' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={categoryOpen} onClose={handleCategoryClose}>
                <DialogTitle>Add Category</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Category Name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCategoryClose}>Cancel</Button>
                    <Button onClick={handleCreateCategory}>Create</Button>
                </DialogActions>
            </Dialog>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Money</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Edit</TableCell>
                        <TableCell>Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactionData.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>{transaction.id}</TableCell>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>{transaction.money}</TableCell>
                            <TableCell>{transaction.category}</TableCell>
                            <TableCell>{transaction.type}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleEditTransaction(transaction.id)}
                                >
                                    Edit
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleDeleteTransaction(transaction.id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};

export default Transactions;
