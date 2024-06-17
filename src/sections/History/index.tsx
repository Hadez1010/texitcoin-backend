import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';

import ChartWidget from 'src/components/ChartWidget';
import { useSettingsContext } from 'src/components/settings';
import CollapsibleTable from 'src/components/CollapsibleTable';

export default function HistoryView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <ChartWidget
            title="Daily Reward"
            subheader="(+20%) than last day"
            chart={{
              categories: [
                '6/4',
                '6/5',
                '6/6',
                '6/7',
                '6/8',
                '6/9',
                '6/10',
                '6/11',
                '6/12',
                '6/13',
                '6/14',
                '6/15',
              ],
              series: [
                {
                  data: [
                    {
                      name: 'Daily Reward',
                      data: [100, 410, 350, 510, 490, 620, 690, 910, 148, 350, 510, 490],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <ChartWidget
            title="Daily Reward(People)"
            subheader="(+20%) than last day"
            chart={{
              colors: ['#ffb136'],
              categories: [
                'Jack',
                'Ross',
                'James',
                'Samantha',
                'Lissa',
                'Sharon',
                'Karin',
                'Tanner',
                'Julie',
                'Kylah',
                'Randy',
                'Leroy',
              ],
              series: [
                {
                  data: [
                    {
                      name: 'Daily Reward',
                      data: [100, 340, 130, 560, 770, 440, 990, 770, 450, 130, 560, 770],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <CollapsibleTable />
      </Grid>
    </Container>
  );
}
