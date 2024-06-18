import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

import HorizontalLinearStepper from 'src/components/Stepper/horizontal-linear-stepper';

import Send from './Send';
import Share from './Share';
import Preview from './Preview';

// ----------------------------------------------------------------------

export default function AwardView() {
  return (
    <Grid container spacing={1}>
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          width: 1,
        }}
      >
        <HorizontalLinearStepper steps={[<Preview />, <Share />, <Send />]} />
      </Paper>
    </Grid>
  );
}
