import React, { ReactElement } from 'react';
import { Grid, Typography } from '@mui/material';
import AddItem from './components/AddItem';
import CardItems from './components/CardItems';

const App: React.FC = (): ReactElement => {
  return (
    <Grid container alignItems="center" style={{ margin: '1rem' }} direction="column">
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
