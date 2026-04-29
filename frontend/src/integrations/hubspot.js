import { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';

export const HubSpotIntegration = ({ user, org, integrationParams, setIntegrationParams }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnectClick = async () => {
        try {
            setIsConnecting(true);
            const formData = new FormData();
            formData.append('user_id', user);
            formData.append('org_id', org);

            const response = await axios.post(`http://localhost:8000/integrations/hubspot/authorize`, formData);
            const authURL = response?.data;
            const newWindow = window.open(authURL, 'HubSpot Authorization', 'width=600, height=600');

            const pollTimer = window.setInterval(() => {
                if (newWindow?.closed !== false) {
                    window.clearInterval(pollTimer);
                    handleWindowClosed();
                }
            }, 200);
        } catch (e) {
            setIsConnecting(false);
            alert(e?.response?.data?.detail);
        }
    };

    const handleWindowClosed = async () => {
        try {
            const formData = new FormData();
            formData.append('user_id', user);
            formData.append('org_id', org);

            const response = await axios.post(`http://localhost:8000/integrations/hubspot/credentials`, formData);
            const credentials = response.data;

            if (credentials) {
                setIsConnected(true);
                setIntegrationParams((prev) => ({ ...prev, credentials, type: 'HubSpot' }));
            }
            setIsConnecting(false);
        } catch (e) {
            setIsConnecting(false);
            alert(e?.response?.data?.detail);
        }
    };

    useEffect(() => {
        setIsConnected(integrationParams?.credentials ? true : false);
    }, []);

    return (
        <Box className="provider-card">
            <Typography>HubSpot</Typography>
            <Typography className={isConnected ? 'status-connected' : 'status-disconnected'}>
                {isConnected ? 'Connected' : 'Not connected'}
            </Typography>
            <Button variant="outlined" onClick={isConnected ? () => {} : handleConnectClick} disabled={isConnecting}>
                {isConnecting ? <CircularProgress size={18} /> : 'Connect'}
            </Button>
        </Box>
    );
};
