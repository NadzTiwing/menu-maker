import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import EnhancedTable from './components/Datatable';

const App = () => {
  return (
    <Grid container spacing={3} alignItems="flex-start" justifyContent="center" style={{ margin: '5rem' }} direction="column">
      <Grid item>
        <Typography variant="h5">Main Content</Typography>
      </Grid>
      <Grid item>
        <EnhancedTable />
      </Grid>
    </Grid>
  );
};

export default App;
