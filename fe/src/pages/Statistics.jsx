import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Button } from '@mui/material';

const Statistics = () => {
    const [statistics, setStatistics] = useState({});
    const [showStatistics, setShowStatistics] = useState(false);

    useEffect(() => {
        if (showStatistics) {
            fetchStatistics();
        }
    }, [showStatistics]);

    const fetchStatistics = async () => {
        try {
            const response = await axios.get('/api/statistics');
            setStatistics(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleShowStatistics = () => {
        setShowStatistics(true);
    };

    return (
        <div>
            <Button variant="contained" onClick={handleShowStatistics}>
                Show Statistics
            </Button>

            {showStatistics && (
                <div>
                    <Typography variant="h4">Statistics</Typography>
                    <Typography variant="h6">Total Income: {statistics['Total Income']}</Typography>
                    <Typography variant="h6">Total Expenses: {statistics['Total Expenses']}</Typography>
                    <Typography variant="h6">Net Income: {statistics['Net Income']}</Typography>
                </div>
            )}
        </div>
    );
};

export default Statistics;
