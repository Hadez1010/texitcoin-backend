import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';

import ChartWidget from 'src/components/ChartWidget';
import WidgetSummary from 'src/components/WidgetSummary';
import CollapsibleTable from 'src/components/CollapsibleTable';

export default function StatisticsSection() {
  const theme = useTheme();

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <WidgetSummary
            title="Total Blocks"
            percent={2.6}
            total={15564}
            chart={{
              colors: [theme.palette.primary.light, theme.palette.primary.main],
              series: [22, 8, 35, 50, 82, 84, 77, 12, 87, 43],
            }}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <WidgetSummary
            title="New Blocks"
            percent={-0.1}
            total={384}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [56, 47, 40, 62, 73, 30, 23, 54, 67, 68],
            }}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <WidgetSummary
            title="Members"
            percent={0.6}
            total={102}
            chart={{
              colors: [theme.palette.secondary.light, theme.palette.secondary.main],
              series: [40, 70, 75, 70, 50, 28, 7, 64, 38, 27],
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <ChartWidget
            title="Hashrate"
            subheader="(+20%) than last day"
            chart={{
              categories: [
                '38312',
                '38313',
                '38314',
                '38315',
                '38316',
                '38317',
                '38318',
                '38319',
                '38320',
                '38321',
                '38322',
                '38323',
              ],
              series: [
                {
                  data: [
                    {
                      name: 'Hashrate',
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
            title="Pos Difficulty"
            subheader="(+20%) than last day"
            chart={{
              colors: ['#ffb136'],
              categories: [
                '38312',
                '38313',
                '38314',
                '38315',
                '38316',
                '38317',
                '38318',
                '38319',
                '38320',
                '38321',
                '38322',
                '38323',
              ],
              series: [
                {
                  data: [
                    {
                      name: 'Pos Difficulty',
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
