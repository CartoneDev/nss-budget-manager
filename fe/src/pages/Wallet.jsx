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
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from "@mui/material";
import Slide from '@mui/material/Slide';
import './styles/Wallet.css';
import {axiosApi} from "../api/axiosApi";

const theme = createTheme();

const Wallet = () => {
    const [state, setState] = useState({});
    useEffect(async () => {
        const response = await axiosApi.wallet();
        console.log(response.data);
        setState(response.data);
    }, []);

    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [currencyChange, setCurrencyChange] = useState('CZK');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [goals, setGoals] = useState([]);
    const [goalName, setGoalName] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const handleCurrencyChange = async (event) => {
        setCurrencyChange(event.target.value);
        const newCurrency = event.target.value;
        try {
            const budgetLimit = await getBudgetLimitForCurrency(newCurrency);
            const amount = await getAmountForCurrency(newCurrency);
            // dispatch({
            //     type: 'SET_CURRENCY',
            //     payload: {
            //         currency: newCurrency,
            //         budget_limit: budgetLimit,
            //         amount: amount,
            //     },
            // });
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

    const handleExport = () => {
        // Implementace exportu dat
        console.log('Data export:', state);
    };

    const handleCloseDialog = () => {
        setIsInitialLoad(false);
    };

    const handleCloseDialogGoals = () => {
        setIsDialogOpen(false);
    };

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleAddGoal = () => {
        const newGoal = {
            name: goalName,
            amount: goalAmount
        };
        setGoals([...goals, newGoal]);
        setGoalName('');
        setGoalAmount('');
        setIsDialogOpen(false);
    };

    const handleRemoveGoal = (index) => {
        const updatedGoals = [...goals];
        updatedGoals.splice(index, 1);
        setGoals(updatedGoals);
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
                    {isInitialLoad && !state["walletId"] ? (
                        <Dialog
                            open={true}
                            TransitionComponent={Transition}
                            keepMounted
                        >
                            <DialogTitle>Wallet does not exist</DialogTitle>
                            <DialogContent>
                                <Typography>Wallet was not found in the database</Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog} color="primary" variant="contained">Close</Button>
                            </DialogActions>
                        </Dialog>
                    ) : (
                        <div>
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
                                <Typography variant="h6">Selected Currency: {currencyChange}</Typography>
                                <FormControl component="fieldset" sx={{ mt: 2, margin: 5, flexDirection: 'row' }}>
                                    <RadioGroup row value={currencyChange} onChange={handleCurrencyChange}>
                                        <FormControlLabel
                                            control={<Radio />}
                                            value="CZK"
                                            name="CZK"
                                            inputProps={{ 'aria-label': 'CZK' }}
                                            color="secondary"
                                            label="CZK"
                                            labelPlacement="top"
                                            sx={{
                                                '& .MuiSvgIcon-root': {
                                                    fontSize: 28,
                                                },
                                            }}
                                        />
                                        <FormControlLabel
                                            control={<Radio />}
                                            value="EUR"
                                            name="EUR"
                                            inputProps={{ 'aria-label': 'EUR' }}
                                            color="secondary"
                                            label="EUR"
                                            labelPlacement="top"
                                            sx={{
                                                '& .MuiSvgIcon-root': {
                                                    fontSize: 28,
                                                },
                                            }}
                                        />
                                        <FormControlLabel
                                            control={<Radio />}
                                            value="USD"
                                            name="USD"
                                            inputProps={{ 'aria-label': 'USD' }}
                                            color="secondary"
                                            label="USD"
                                            labelPlacement="top"
                                            sx={{
                                                '& .MuiSvgIcon-root': {
                                                    fontSize: 28,
                                                },
                                            }}
                                        />
                                    </RadioGroup>
                                </FormControl>
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
                                    <Typography component="h1" variant="h5">
                                        <strong>Wallet name:</strong> {state["name"]}
                                    </Typography>
                                    <Typography component="p">
                                        <strong>Budget Limit:</strong> {state["budgetLimit"]} {state["currency"]}
                                    </Typography>
                                    <Typography component="p">
                                        <strong>Amount:</strong> {state["amount"]} {state["currency"]}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    paddingTop: 50,
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'flex-end',
                                    mt: 'auto',
                                }}
                            >
                                <Button
                                    onClick={handleExport}
                                    variant="contained"
                                    color="primary"
                                >
                                    Exportovat
                                </Button>
                                <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                                    Add goals
                                </Button>
                                { goals.map((goal, index) => (
                                    <div key={index}>
                                        <p>
                                            <strong>Name:</strong> {goal.name}
                                        </p>
                                        <p>
                                            <strong>Amount:</strong> {goal.amount}
                                        </p>
                                        <Button variant="contained" color="secondary" onClick={() => handleRemoveGoal(index)}>
                                            Remove goals
                                        </Button>
                                    </div>
                                ))}
                                <Dialog open={isDialogOpen} onClose={handleCloseDialogGoals}>
                                    <DialogTitle>Add goals</DialogTitle>
                                    <DialogContent>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="goalName"
                                            label="Name"
                                            type="text"
                                            fullWidth
                                            value={goalName}
                                            onChange={(e) => setGoalName(e.target.value)}
                                        />
                                        <TextField
                                            margin="dense"
                                            id="goalAmount"
                                            label="Amount"
                                            type="number"
                                            fullWidth
                                            value={goalAmount}
                                            onChange={(e) => setGoalAmount(e.target.value)}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleCloseDialogGoals} color="primary">
                                            Cansel
                                        </Button>
                                        <Button onClick={handleAddGoal} color="primary">
                                            Add
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </Box>
                        </div>
                    )}
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Wallet;