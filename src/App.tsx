import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import AddItem from './components/AddItem';
import CardItems from './components/CardItems';

const App = () => {
  return (
    <Grid container alignItems="flex-start" style={{ margin: '1rem' }} direction="column">
      <Grid sx={{ alignSelf: "center" }} item>
        <Typography variant="h5" >Menu Maker App</Typography>
      </Grid>
      <Grid item>
        <AddItem />
      </Grid>
      <Grid item>
        <CardItems />
      </Grid>
    </Grid>
  );
};

export default App;
