import { useState } from 'react';
import {
    Box,
    Button,
    Typography
} from '@mui/material';
import axios from 'axios';

const endpointMapping = {
    'Notion': 'notion',
    'Airtable': 'airtable',
    'HubSpot': 'hubspot',
};

export const DataForm = ({ integrationType, credentials }) => {
    const [loadedData, setLoadedData] = useState(null);
    const endpoint = endpointMapping[integrationType];

    const handleLoad = async () => {
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
        <Box display='flex' flexDirection='column' width='100%' alignItems='center'>

            <Box width="100%" maxWidth={500}>

                <Button
                    onClick={handleLoad}
                    sx={{ mt: 2 }}
                    variant='contained'
                    fullWidth
                >
                    Load Data
                </Button>

                <Button
                    onClick={() => setLoadedData(null)}
                    sx={{ mt: 1 }}
                    variant='outlined'
                    fullWidth
                >
                    Clear Data
                </Button>

                {loadedData && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Loaded Data
                        </Typography>

                        {loadedData.map((item) => (
                            <Box
                                key={item.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '10px',
                                    borderBottom: '1px solid #eee'
                                }}
                            >
                                <Typography>{item.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {item.type}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}

            </Box>
        </Box>
    );
};