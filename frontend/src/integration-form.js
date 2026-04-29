import { useState } from 'react';
import {
    Box,
    Autocomplete,
    TextField,
    Typography,
    Button,
} from '@mui/material';
import { AirtableIntegration } from './integrations/airtable';
import { NotionIntegration } from './integrations/notion';
import { HubSpotIntegration } from './integrations/hubspot';
import { DataForm } from './data-form';

const integrationMapping = {
    Notion: NotionIntegration,
    Airtable: AirtableIntegration,
    HubSpot: HubSpotIntegration,
};

const navItems = [
    { label: 'Dashboard', active: true },
    { label: 'Connections' },
    { label: 'Workflows' },
    { label: 'Activity' },
    { label: 'Settings' },
];

export const IntegrationForm = () => {
    const [integrationParams, setIntegrationParams] = useState({});
    const [user, setUser] = useState('TestUser');
    const [org, setOrg] = useState('TestOrg');
    const [currType, setCurrType] = useState('HubSpot');
    const CurrIntegration = integrationMapping[currType];

    return (
        <Box className="app-shell">
            <Box className="sidebar">
                <Typography className="brand">SyncHub</Typography>
                <Typography className="tier">Enterprise Tier</Typography>
                <Button className="new-connection">
                    New Connection
                </Button>
                <Box className="nav-list">
                    {navItems.map((item) => (
                        <Box key={item.label} className={`nav-item ${item.active ? 'active' : ''}`}>
                            <Typography>{item.label}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box className="main-content">
                <Typography className="top-title">Integration Manager</Typography>
                <Typography variant="h6" className="section-title">Integration Dashboard</Typography>
                <Typography className="section-subtitle">Connect and manage your integrations</Typography>

                <Box className="dashboard-grid">
                    <Box className="left-column">
                        <Box className="panel">
                            <Typography className="panel-title">Configuration</Typography>
                            <TextField label="Organization ID" value={org} onChange={(e) => setOrg(e.target.value)} size="small" />
                            <TextField label="User ID" value={user} onChange={(e) => setUser(e.target.value)} size="small" />
                        </Box>

                        <Box className="panel">
                            <Typography className="panel-title">Provider</Typography>
                            <Autocomplete
                                id="integration-type"
                                options={Object.keys(integrationMapping)}
                                value={currType}
                                size="small"
                                renderInput={(params) => <TextField {...params} label="Select Integration" />}
                                onChange={(e, value) => setCurrType(value)}
                            />
                            {currType && (
                                <CurrIntegration
                                    user={user}
                                    org={org}
                                    integrationParams={integrationParams}
                                    setIntegrationParams={setIntegrationParams}
                                />
                            )}
                        </Box>
                    </Box>

                    <DataForm integrationType={integrationParams?.type} credentials={integrationParams?.credentials} />
                </Box>
            </Box>
        </Box>
    );
};
