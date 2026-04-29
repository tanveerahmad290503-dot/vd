import { useMemo, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    TextField,
} from '@mui/material';
import axios from 'axios';

const endpointMapping = {
    Notion: 'notion',
    Airtable: 'airtable',
    HubSpot: 'hubspot',
};

export const DataForm = ({ integrationType, credentials }) => {
    const [loadedData, setLoadedData] = useState(null);
    const endpoint = useMemo(() => endpointMapping[integrationType], [integrationType]);

    const handleLoad = async () => {
        if (!credentials || !endpoint) return;
        try {
            const formData = new FormData();
            formData.append('credentials', JSON.stringify(credentials));

            const response = await axios.post(
                `http://localhost:8000/integrations/${endpoint}/load`,
                formData
            );

            setLoadedData(response.data);
        } catch (e) {
            alert(e?.response?.data?.detail);
        }
    };

    return (
        <Box className="data-column">
            <Box className="panel data-panel">
                <Box className="data-header">
                    <Typography className="panel-title">Synchronized Data</Typography>
                    <TextField placeholder="Filter Items..." size="small" disabled />
                </Box>

                <Box className="data-body">
                    {loadedData?.length ? (
                        loadedData.map((item) => (
                            <Box key={item.id} className="data-row">
                                <Typography>{item.name}</Typography>
                                <Typography variant="caption">{item.type}</Typography>
                            </Box>
                        ))
                    ) : (
                        <Box className="empty-state">
                            <Typography sx={{ fontSize: 32 }}>◌</Typography>
                            <Typography className="empty-title">No data loaded yet</Typography>
                            <Typography className="empty-subtitle">
                                Connect an integration and load data to see your synchronized items appear here.
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
            <Box className="load-actions">
                <Button onClick={handleLoad} variant="contained" disabled={!credentials}>Load Data</Button>
                <Button onClick={() => setLoadedData(null)} variant="outlined">Clear Data</Button>
            </Box>
        </Box>
    );
};
