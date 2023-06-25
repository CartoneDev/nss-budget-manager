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
import {axiosApi} from "../api/axiosApi";

const theme = createTheme();

const Dashboard = () => {
    const [state, setState] = useState({});
    const [transactionData, setTransactionData] = useState([]);
    const [goalsData, setGoalsData] = useState([]);
    const [newTransaction, setNewTransaction] = useState({});
    const [newGoal, setNewGoal] = useState({});
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [currencyChange, setCurrencyChange] = useState('CZK');
    const [showGoals, setShowGoals] = useState(false); // New state variable for showing goals
    const [showTransactions, setShowTransactions] = useState(false);

    useEffect(() => {
        (async () => {
            const res = await axiosApi.getAllTrans();
            const resWallet = await axiosApi.wallet();
            console.log(res.data)
            console.log(resWallet.data)
            setState(resWallet.data);
            setTransactionData([...res.data, newTransaction]);
            const resGoals = await axiosApi.getAllGoals();
            setGoalsData([...resGoals.data, newGoal]);
            console.log(resGoals.data);
            console.log(goalsData);

            setIsInitialLoad(false);
        })();
    }, []);

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
                                    <strong>Budget Limit:</strong> {state.budgetLimit} {state.currency}
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
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: 'bolder'}}>Name</TableCell>
                                            <TableCell sx={{fontWeight: 'bolder'}}>Goal</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {goalsData.map((g) => (
                                            <TableRow>
                                                <TableCell>{g.goal}</TableCell>
                                                <TableCell>{g.moneyGoal}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
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
                                    {transactionData.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell>{transaction.description}</TableCell>
                                            <TableCell>{transaction.id}</TableCell>
                                            <TableCell>{transaction.dateTime?.slice(0, 10)}</TableCell>
                                            <TableCell>{transaction.money}</TableCell>
                                            <TableCell>{transaction.category}</TableCell>
                                            <TableCell>{transaction.typeTransaction}</TableCell>
                                        </TableRow>
                                    ))}
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