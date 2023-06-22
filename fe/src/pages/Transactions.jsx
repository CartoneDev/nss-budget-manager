import React, {useEffect, useState} from 'react';
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
    Box, InputLabel,
} from '@mui/material';
import {axiosApi} from "../api/axiosApi";

const Transactions = () => {
    const [transactionData, setTransactionData] = useState([]);
    const [newTransaction, setNewTransaction] = useState({});
    useEffect(() => {
        (async () => {
            const res = await axiosApi.getAllTrans();
            const resCat = await axiosApi.getAllCategories();
            const array = resCat.data.map(obj => obj.name);
            console.log(res.data);
            console.log(array);
            setTransactionData([...res.data, newTransaction]);
            setCategories([...array, newCategory]);
        })();
    }, []);
    const [open, setOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [transactionTypes] = useState(['INCOME', 'EXPENSE']);
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
            typeTransaction: '',
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
            const transaction = transactionData.find(
                (transaction) => transaction.id === editTransactionId
            );
            const trans = {
                description: newTransaction.description,
                money: newTransaction.money,
                typeTransaction: newTransaction.typeTransaction,
            }
            console.log(trans)
            axiosApi.editTransaction(editTransactionId, trans);
            setEditMode(false);
            setEditTransactionId(null);
        } else {
            const trans = {
                description: newTransaction.description,
                money: newTransaction.money,
                typeTransaction: newTransaction.typeTransaction,
                category: {
                    name: newTransaction.category
                }
            }
            console.log(trans);
            axiosApi.addTrans(trans);
        }
        setNewTransaction({
            description: '',
            money: '',
            category: '',
            typeTransaction: '',
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
        axiosApi.deleteTransaction(transactionId);
    };

    const handleCreateCategory = () => {
        const category = {
            name: newCategory
        }
        console.log(category);
        axiosApi.addCategory(category);
        setNewCategory('');
        setCategoryOpen(false);
    };

    const handleTypeChange = (event) => {
        setNewTransaction({
            ...newTransaction,
            typeTransaction: event.target.value,
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
                            value={newTransaction.typeTransaction}
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
                            <TableCell>{transaction.dateTime?.slice(0, 10)}</TableCell>
                            <TableCell>{transaction.money}</TableCell>
                            <TableCell>{transaction.category}</TableCell>
                            <TableCell>{transaction.typeTransaction}</TableCell>
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
