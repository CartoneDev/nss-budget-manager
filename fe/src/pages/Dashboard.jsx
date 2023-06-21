import React, { useState, useEffect, useReducer } from 'react';
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme();

const initialState = {
    wallet_id: null,
    amount: 0,
    client: '',
    name: '',
    budget_limit: null,
    currency: '',
    amountGoal: '',
    nameGoal: '',
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_WALLET':
            return { ...state, ...action.payload };
        case 'SET_CURRENCY':
            return { ...state, currency: action.payload.currency, budget_limit: action.payload.budget_limit, amount: action.payload.amount };
        case 'SET_GOALS':
            return { ...state, amountGoal: action.payload.amountGoal, NameGoal: action.payload.NameGoal };
        default:
            return state;
    }
};

const Dashboard = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [currencyChange, setCurrencyChange] = useState('CZK');
    const [showGoals, setShowGoals] = useState(false); // New state variable for showing goals
    const [showTransactions, setShowTransactions] = useState(false);


    useEffect(() => {
        const storedState = localStorage.getItem('walletState');
        if (storedState) {
            dispatch({ type: 'SET_WALLET', payload: JSON.parse(storedState) });
            setIsInitialLoad(false); // Set initial load to false if data exists in localStorage
        } else {
            fetchWalletData()
                .then((data) => {
                    if (data && data.wallet_id) {
                        dispatch({ type: 'SET_WALLET', payload: data });
                    } else {
                        console.log('Wallet does not exist in the database.');
                    }
                    setIsInitialLoad(false); // Set initial load to false after fetching data
                })
                .catch((error) => {
                    console.log('Error loading data from the database:', error);
                    setIsInitialLoad(false); // Set initial load to false if error occurs
                });
        }
    }, []);

    const fetchWalletData = async () => {
        try {
            const response = await fetch('/api/wallet');
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Invalid response from the server.');
            }
        } catch (error) {
            throw new Error('Error loading data from the API: ' + error.message);
        }
    };

    const handleCurrencyChange = async (event) => {
        setCurrencyChange(event.target.value);
        const newCurrency = event.target.value;
        try {
            const budgetLimit = await getBudgetLimitForCurrency(newCurrency);
            const amount = await getAmountForCurrency(newCurrency);
            dispatch({
                type: 'SET_CURRENCY',
                payload: {
                    currency: newCurrency,
                    budget_limit: budgetLimit,
                    amount: amount,
                },
            });
        } catch (error) {
            console.log('Error while changing the currency:', error);
        }
    };

    const getBudgetLimitForCurrency = async (currency) => {
        try {
            const response = await fetch(`API_URL/getBudgetLimit?currency=${currency}`);
            const data = await response.json();
            return data.budget_limit;
        } catch (error) {
            throw new Error('Error while retrieving the budget limit:', error);
        }
    };

    const getAmountForCurrency = async (currency) => {
        try {
            const response = await fetch(`API_URL/getAmount?currency=${currency}`);
            const data = await response.json();
            return data.amount;
        } catch (error) {
            throw new Error('Error while retrieving the total income:', error);
        }
    };

    const handleGoalsClick = () => {
        setShowGoals(!showGoals); // Toggle the showGoals state on button click
    };

    const handleShowTransactions = () => {
        setShowTransactions(!showTransactions);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="sm">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '0 16px',
                    }}
                >
                    <Box
                        sx={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            border: '1px solid #ccc',
                            borderRadius: '24px',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                            padding: '16px',
                            maxWidth: '400px',
                            margin: '0 auto',
                        }}
                    >
                        {isInitialLoad ? (
                            <Typography variant="h6">Loading...</Typography>
                        ) : (
                            <>
                                <Typography variant="h6">Selected Currency: {currencyChange}</Typography>
                                <Typography component="h1" variant="h5">
                                    <strong>Wallet name:</strong> {state.name}
                                </Typography>
                                <Typography component="p">
                                    <strong>Budget Limit:</strong> {state.budget_limit} {state.currency}
                                </Typography>
                                <Typography component="p">
                                    <strong>Amount:</strong> {state.amount} {state.currency}
                                </Typography>
                            </>
                        )}
                    </Box>
                    <Box
                        sx={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            border: '1px solid #ccc',
                            borderRadius: '24px',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                            padding: '16px',
                            maxWidth: '400px',
                            margin: '0 auto',
                            marginTop: '16px', // Add margin top to separate from the wallet information box
                        }}
                    >
                        {/* ... Existing JSX code ... */}
                        <Button variant="outlined" onClick={handleGoalsClick} sx={{ marginTop: '16px' }}>
                            Goals
                        </Button>
                        {showGoals && (
                            <Typography component="p" sx={{ marginTop: '8px' }}>
                                <strong>Goal Name:</strong> {state.NameGoal}
                                <strong>Goal Amount:</strong> {state.amountGoal}
                            </Typography>
                        )}
                    </Box>
                    <Box
                        sx={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            border: '1px solid #ccc',
                            borderRadius: '24px',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                            padding: '16px',
                            margin: '0 auto',
                            marginTop: '16px', // Add margin top to separate from the wallet information box
                        }}
                    >
                        <Button variant="contained" onClick={handleShowTransactions}>
                            {showTransactions ? 'Hide Transactions' : 'Show Transactions'}
                        </Button>
                        {showTransactions && (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Description</TableCell>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Money</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Type</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Render transactions here */}
                                </TableBody>
                            </Table>
                        )}
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Dashboard;