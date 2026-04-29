import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Typography,
    Card,
    CardContent,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import axios from 'axios';

export const HubSpotIntegration = ({ user, org, integrationParams, setIntegrationParams }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [items, setItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(false);

    // =========================
    // CONNECT (UNCHANGED)
    // =========================
    const handleConnectClick = async () => {
        try {
            setIsConnecting(true);
            const formData = new FormData();
            formData.append('user_id', user);
            formData.append('org_id', org);

            const response = await axios.post(
                `http://localhost:8000/integrations/hubspot/authorize`,
                formData
            );

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

    // =========================
    // CALLBACK HANDLER (UNCHANGED)
    // =========================
    const handleWindowClosed = async () => {
        try {
            const formData = new FormData();
            formData.append('user_id', user);
            formData.append('org_id', org);

            const response = await axios.post(
                `http://localhost:8000/integrations/hubspot/credentials`,
                formData
            );

            const credentials = response.data;

            if (credentials) {
                setIsConnected(true);
                setIntegrationParams(prev => ({
                    ...prev,
                    credentials: credentials,
                    type: 'HubSpot'
                }));
            }

            setIsConnecting(false);
        } catch (e) {
            setIsConnecting(false);
            alert(e?.response?.data?.detail);
        }
    };

    // =========================
    // LOAD DATA (NEW)
    // =========================
    const handleLoadData = async () => {
        try {
            setLoadingItems(true);

            const formData = new FormData();
            formData.append('user_id', user);
            formData.append('org_id', org);

            const response = await axios.post(
                `http://localhost:8000/integrations/hubspot/load`,
                formData
            );

            setItems(response.data);
        } catch (e) {
            alert(e?.response?.data?.detail);
        } finally {
            setLoadingItems(false);
        }
    };

    useEffect(() => {
        setIsConnected(integrationParams?.credentials ? true : false);
    }, []);

    // =========================
    // UI
    // =========================
    return (
        <Box display="flex" justifyContent="center" mt={4}>
            <Card sx={{ width: 500, borderRadius: 3, boxShadow: 4 }}>
                <CardContent>

                    {/* TITLE */}
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                        HubSpot Integration
                    </Typography>

                    {/* STATUS */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="body2">Status</Typography>
                        <Chip
                            label={isConnected ? "Connected" : "Not Connected"}
                            color={isConnected ? "success" : "error"}
                            size="small"
                        />
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* ACTION BUTTONS */}
                    <Box display="flex" gap={2} mb={2}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={isConnected ? () => {} : handleConnectClick}
                            disabled={isConnecting}
                            color="primary"
                        >
                            {isConnecting ? <CircularProgress size={20} /> : "Connect"}
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleLoadData}
                            disabled={!isConnected || loadingItems}
                        >
                            {loadingItems ? <CircularProgress size={20} /> : "Load Data"}
                        </Button>
                    </Box>

                    {/* DATA LIST */}
                    <Box maxHeight={250} overflow="auto">
                        {items.length > 0 ? (
                            <List dense>
                                {items.map((item) => (
                                    <ListItem key={item.id} divider>
                                        <ListItemText
                                            primary={item.name}
                                            secondary={item.type}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" color="text.secondary" align="center">
                                No data loaded yet
                            </Typography>
                        )}
                    </Box>

                </CardContent>
            </Card>
        </Box>
    );
};