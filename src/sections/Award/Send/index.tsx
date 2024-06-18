import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';

import ComponentBlock from 'src/components/Component-Block';

export default function Send() {
  const sendmany = [
    'sendmany "" "{',
    '"TZv8yqaApXxxEAbr6msYiXorN839CmdbFq": 19000,',
    '"TbGWvgFVhbxD8RpAd9mWpuQcqLT1sd7n5t": 19000,',
    '"Te4cN9yuqapro1MoDkzvRvb9bgCtNbmpfP": 19000,',
    '"Th8Msbi91ePWv2AHzpJZ1hJGxZBZ7ewnxz": 19000,',
    '"TixxDLboL7wP1MyA76V1BHhxKVnfArrvQf": 19000}',
  ];

  return (
    <Card sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid xs={12} md={3}>
          <Typography>
            <strong>Date:</strong> 2024-04-06
          </Typography>
          <Typography>
            <strong>Total TXC Shared:</strong> 95000
          </Typography>
          <ButtonGroup variant="contained" color="primary" sx={{ mt: 5 }}>
            <Button>Send</Button>
          </ButtonGroup>
        </Grid>
        <Grid xs={12} md={1}>
          <Typography>
            <strong>Result:</strong>
          </Typography>
        </Grid>
        <Grid xs={12} md={8}>
          <ComponentBlock
            sx={{ display: 'block', alignItems: 'unset', overflow: 'auto', maxHeight: 400 }}
          >
            {sendmany.map((item) => (
              <Typography variant="body1">{item}</Typography>
            ))}
          </ComponentBlock>
        </Grid>
      </Grid>
    </Card>
  );
}
