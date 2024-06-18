import Card from '@mui/material/Card';
// import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// import ButtonGroup from '@mui/material/ButtonGroup';

import Table from './table';

export default function Preview() {
  const today = new Date();

  return (
    <>
      <Grid container spacing={3} sx={{ pl: 1 }}>
        <Grid xs={4} md={2}>
          <Typography variant="subtitle2">Last Award Time:</Typography>
        </Grid>
        <Grid xs={8} md={4}>
          <Typography variant="caption">2024-06-11 10:23:52</Typography>
        </Grid>
        <Grid xs={4} md={2}>
          <Typography variant="subtitle2">Last Mined Block Count: </Typography>
        </Grid>
        <Grid xs={8} md={4}>
          <Typography variant="caption">37809</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ pl: 1 }}>
        <Grid xs={4} md={2} sx={{ pt: 2 }}>
          <Typography variant="subtitle2">Award Time:</Typography>
        </Grid>
        <Grid xs={8} md={4}>
          <TextField
            // sx={{ width: 300 }}
            variant="outlined"
            required
            size="small"
            label="Award Time"
            defaultValue={today.toLocaleDateString()}
          />
        </Grid>
        <Grid xs={4} md={2}>
          <Typography variant="subtitle2">Blocks at 2024-06-17: </Typography>
        </Grid>
        <Grid xs={8} md={4}>
          <Typography variant="caption">37950</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ pl: 1 }}>
        <Grid xs={4} md={2} xsOffset={6}>
          <Typography variant="subtitle2">New Blocks: </Typography>
        </Grid>
        <Grid xs={8} md={4}>
          <Typography variant="caption">141</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ pl: 1 }}>
        <Grid xs={4} md={2} xsOffset={6}>
          <Typography variant="subtitle2">TXC Shared: </Typography>
        </Grid>
        <Grid xs={8} md={4}>
          <Typography variant="caption">35814</Typography>
        </Grid>
      </Grid>
      <Card sx={{ width: 1, mt: 2 }}>
        <Table />
      </Card>
    </>
  );
}
