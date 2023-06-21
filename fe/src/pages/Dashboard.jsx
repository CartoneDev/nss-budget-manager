import React, { useState, useEffect, useReducer } from 'react';
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { createTheme, ThemeProvider } from "@mui/material";
import './styles/Wallet.css';

const theme = createTheme();

const initialState = {
    wallet_id: null,
    amount: 0,
    client: '',
    name: '',
    budget_limit: null,
    currency: '',
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_WALLET':
            return { ...state, ...action.payload };
        case 'SET_CURRENCY':
            return { ...state, currency: action.payload.currency };
        case 'SET_BUDGET_LIMIT':
            return { ...state, budget_limit: action.payload };
        case 'SET_AMOUNT':
            return { ...state, amount: action.payload };
        default:
            return state;
    }
};

const Dashboard = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [currencyChange, setCurrencyChange] = useState('CZK');

    useEffect(() => {
        // Tento kód se spustí při načtení stránky
        const storedState = localStorage.getItem('walletState');
        if (storedState) {
            dispatch({ type: 'SET_WALLET', payload: JSON.parse(storedState) });
        } else {
            fetchWalletData()
                .then((data) => {
                    if (data && data.wallet_id) {
                        dispatch({ type: 'SET_WALLET', payload: data });
                    } else {
                        console.log('Wallet does not exist in the database.');
                    }
                })
                .catch((error) => {
                    console.log('Error loading data from the database:', error);
                });
        }

        // Tento kód se spustí při změně hodnoty currencyChange
        updateBudgetLimitAndAmount();
    });

    const fetchWalletData = async () => {
        try {
            const response = await fetch('/api/wallet');
            if (response.ok) {
                return await response.json();;
            } else {
                throw new Error('Invalid response from the server.');
            }
        } catch (error) {
            throw new Error('Error loading data from the API: ' + error.message);
        }
    };

    const handleCurrencyChange = (event) => {
        setCurrencyChange(event.target.value);
    };

    const updateBudgetLimitAndAmount = async () => {
        try {
            const budgetLimit = await getBudgetLimitForCurrency(currencyChange);
            const amount = await getAmountForCurrency(currencyChange);
            dispatch({ type: 'SET_BUDGET_LIMIT', payload: budgetLimit });
            dispatch({ type: 'SET_AMOUNT', payload: amount });
        } catch (error) {
            console.log('Error while updating budget limit and amount:', error);
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
            throw new Error('Error while retrieving the amount:', error);
        }
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
                            border: '1px',
                            borderRadius: '24px',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                            padding: '16px',
                            margin: '10 auto',
                        }}
                    >
                        <RadioGroup
                            row
                            aria-label="currency"
                            name="currency"
                            value={currencyChange}
                            onChange={handleCurrencyChange}
                            sx={{ padding: '16px' }}
                        >
                            <FormControlLabel value="CZK" control={<Radio />} label="CZK" />
                            <FormControlLabel value="USD" control={<Radio />} label="USD" />
                            <FormControlLabel value="EUR" control={<Radio />} label="EUR" />
                        </RadioGroup>
                        <Typography component="h1" variant="h5">
                            <strong>Wallet name:</strong> {state.name}
                        </Typography>
                        <Typography component="p">
                            <strong>Budget Limit:</strong> {state.budget_limit} {state.currency}
                        </Typography>
                        <Typography component="p">
                            <strong>Amount:</strong> {state.amount} {state.currency}
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Dashboard;