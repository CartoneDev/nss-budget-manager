import React, { useState, useEffect, useReducer } from 'react';
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { createTheme, ThemeProvider, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Slide from '@mui/material/Slide';
import './Wallet.css';

const theme = createTheme();

const initialState = {
    wallet_id: null,
    amount: 0,
    client: '',
    name: '',
    budget_limit: null,
    currency: '',
    expenses: [],
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_WALLET':
            return { ...state, ...action.payload };
        case 'SET_CURRENCY':
            return { ...state, currency: action.payload.currency, budget_limit: action.payload.budget_limit, amount: action.payload.amount };
        default:
            return state;
    }
};

const Wallet = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    useEffect(() => {
        const storedState = localStorage.getItem('walletState');
        if (storedState) {
            dispatch({ type: 'SET_WALLET', payload: JSON.parse(storedState) });
        } else {
            fetchWalletData()
                .then((data) => {
                    if (data && data.wallet_id) {
                        dispatch({ type: 'SET_WALLET', payload: data });
                    } else {
                        console.log('Wallet neexistuje v databázi.');
                    }
                })
                .catch((error) => {
                    console.log('Chyba při načítání dat z databáze:', error);
                });
        }
    }, []);

    const fetchWalletData = async () => {
        try {
            const response = await fetch('/api/wallet');
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error('Neplatná odpověď ze serveru');
            }
        } catch (error) {
            throw new Error('Chyba při načítání dat z API: ' + error.message);
        }
    };

    const handleCurrencyChange = async (event) => {
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
            console.log('Chyba při změně měny:', error);
        }
    };

    const getBudgetLimitForCurrency = async (currency) => {
        try {
            const response = await fetch(`API_URL/getBudgetLimit?currency=${currency}`);
            const data = await response.json();
            return data.budget_limit;
        } catch (error) {
            throw new Error('Chyba při získávání rozpočtového limitu:', error);
        }
    };

    const getAmountForCurrency = async (currency) => {
        try {
            const response = await fetch(`API_URL/getAmount?currency=${currency}`);
            const data = await response.json();
            return data.amount;
        } catch (error) {
            throw new Error('Chyba při získávání celkového příjmu:', error);
        }
    };

    const handleExport = () => {
        // Implementace exportu dat
        console.log('Export dat:', state);
    };

    const handleCloseDialog = () => {
        setIsInitialLoad(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="sm">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {isInitialLoad && !state.wallet_id ? (
                        <Dialog
                            open={true}
                            TransitionComponent={Transition}
                            keepMounted
                        >
                            <DialogTitle>Wallet neexistuje</DialogTitle>
                            <DialogContent>
                                <Typography>Wallet nebyl nalezen v databázi.</Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog} color="primary" variant="contained">Zavřít</Button>
                            </DialogActions>
                        </Dialog>
                    ) : (
                        <div>
                            <Typography component="h1" variant="h5">
                                {state.name}
                            </Typography>
                            <Typography component="p">
                                <strong>Budget Limit:</strong> {state.budget_limit} {state.currency}
                            </Typography>
                            <Typography component="p">
                                <strong>Celkový příjem:</strong> {state.amount} {state.currency}
                            </Typography>

                            <FormControl sx={{ mt: 2 }}>
                                <InputLabel id="currency-label">Měna</InputLabel>
                                <Select
                                    labelId="currency-label"
                                    id="currency-select"
                                    value={state.currency}
                                    onChange={handleCurrencyChange}
                                >
                                    <MenuItem value="USD">USD</MenuItem>
                                    <MenuItem value="EUR">EUR</MenuItem>
                                    <MenuItem value="CZK">CZK</MenuItem>
                                </Select>
                            </FormControl>

                            <Button
                                sx={{ mt: 2 }}
                                onClick={handleExport}
                                variant="contained"
                                color="primary"
                            >
                                Exportovat
                            </Button>
                        </div>
                    )}
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Wallet;