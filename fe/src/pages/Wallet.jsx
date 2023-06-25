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
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";

const theme = createTheme();

const Wallet = () => {
    const [state, setState] = useState({});
    useEffect(() => {
        (async () => {
            const response = await axiosApi.wallet();
            const resGoal = await axiosApi.getAllGoals();
            console.log(resGoal.data);
            console.log(response.data);
            setState(response.data);
            setGoals([...resGoal.data, newGoal]);
        })();
    }, []);

    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [currencyChange, setCurrencyChange] = useState('CZK');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState({});
    const [goalName, setGoalName] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [addedAmount, setAddedAmount] = useState('');
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const handleAddMoney = () => {
        const amountToAdd = parseFloat(addedAmount);
        console.log(amountToAdd);
        if (!isNaN(amountToAdd) && amountToAdd > 0) {
            axiosApi.addMoney(amountToAdd);
        }
        setAddedAmount('');
        // window.location.reload();
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

    const handleAddGoal = async () => {
        const newGoal = {
            goal: goalName,
            moneyGoal: parseFloat(goalAmount),
        };

        axiosApi.addGoal(newGoal);

        setGoalName('');
        setGoalAmount('');
        setIsDialogOpen(false);
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
                                    <RadioGroup row value={currencyChange}>
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
                            <TextField
                                margin="dense"
                                id="addedAmount"
                                label="Amount to Add"
                                type="number"
                                fullWidth
                                value={addedAmount}
                                onChange={(e) => setAddedAmount(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddMoney}
                            >
                                Add Money
                            </Button>

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

                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: 'bolder'}}>Name</TableCell>
                                            <TableCell sx={{fontWeight: 'bolder'}}>Goal</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {goals.map((g) => (
                                            <TableRow>
                                                <TableCell>{g.goal}</TableCell>
                                                <TableCell>{g.moneyGoal}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

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
                                            Cancel
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