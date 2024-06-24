import { useMemo, useState } from 'react';
import { useMutation, useQuery as useGraphQuery } from '@apollo/client';

import Card from '@mui/material/Card';
import { Paper } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';

import { useQuery } from 'src/routes/hooks';

import ComponentBlock from 'src/components/Component-Block';

import { IStatisticsFilters, IStatisticsPrismaFilter } from 'src/types/statistics';

import Table from './table';
import { FETCH_BLOCKS_QUERY, CONFIRM_STATISTICS_MUTATION } from './query';

const defaultFilter = {
  search: '',
};

export default function Preview() {
  const today = new Date();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sendmany, setSendmany] = useState<string[]>([]);

  const [query] = useQuery<IStatisticsFilters>();

  const { filter = defaultFilter } = query;

  const changeStatus = (status: boolean) => {
    if (status) {
      handleSubmit();
    }

    setIsOpen(status);
  };

  const graphQueryFilter = useMemo(() => {
    const filterObj: IStatisticsPrismaFilter = {};

    if (filter.search) {
      filterObj.OR = [{}];
    }

    return filterObj;
  }, [filter]);

  const { loading: blockLoading, data: blocksData } = useGraphQuery(FETCH_BLOCKS_QUERY, {
    variables: {
      page: '1,1000',
      filter: graphQueryFilter,
      sort: 'blockNo',
    },
  });

  const [getResults] = useMutation(CONFIRM_STATISTICS_MUTATION);

  const handleSubmit = async () => {
    try {
      const response = await getResults({
        variables: { data: { status: true } },
      });

      const result = response!.data!.confirmStatistics!.results;

      const initial = ['sendmany "" "{'];
      const data = result!.map((item) => `\\"${item.txcCold}\\": ${item.txcShared},`);

      setSendmany([...initial, ...data]);
    } catch (error) {
      console.log('error => ', error);
    }
  };

  const blocks = blockLoading ? { blocks: [], total: 0 } : blocksData?.blocks;

  const newBlocks = blocks!.blocks!.reduce(
    (prev, item) => (item?.createdAt > today ? prev + 1 : prev),
    0
  );

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
          <Typography variant="caption">{blocks!.total! - newBlocks}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ pl: 1 }}>
        <Grid xs={4} md={2} sx={{ pt: 2 }}>
          <Typography variant="subtitle2">Award Time:</Typography>
        </Grid>
        <Grid xs={8} md={4}>
          <TextField
            variant="outlined"
            required
            size="small"
            label="Award Time"
            defaultValue={today.toLocaleDateString()}
          />
        </Grid>
        <Grid xs={4} md={2}>
          <Typography variant="subtitle2">Blocks at {today.toLocaleDateString()}: </Typography>
        </Grid>
        <Grid xs={8} md={4}>
          <Typography variant="caption">{blocks!.total}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ pl: 1 }}>
        <Grid xs={4} md={2} xsOffset={6}>
          <Typography variant="subtitle2">New Blocks: </Typography>
        </Grid>
        <Grid xs={8} md={4}>
          <Typography variant="caption">{newBlocks}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ pl: 1 }}>
        <Grid xs={4} md={2}>
          Members
        </Grid>
        <Grid xs={8} md={4}>
          123
        </Grid>
        <Grid xs={4} md={2}>
          <Typography variant="subtitle2">TXC Shared: </Typography>
        </Grid>
        <Grid xs={8} md={4}>
          <Typography variant="caption">{newBlocks * 254}</Typography>
        </Grid>
      </Grid>
      <Card sx={{ width: 1, mt: 2 }}>
        <Table title="Sales" changeStatus={changeStatus} />
      </Card>

      {isOpen && (
        <Drawer
          open={isOpen}
          onClose={() => changeStatus(false)}
          slotProps={{ backdrop: { invisible: true } }}
          PaperProps={{
            sx: {
              width: 800,
            },
          }}
        >
          <Paper sx={{ p: 2 }}>
            <ComponentBlock
              sx={{ display: 'block', alignItems: 'unset', overflow: 'auto', maxHeight: 400 }}
            >
              {sendmany.map((item) => (
                <Typography variant="body1">{item}</Typography>
              ))}
            </ComponentBlock>
          </Paper>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'right' }}>
            <ButtonGroup variant="contained" color="primary">
              <Button onClick={() => changeStatus(false)}>Send</Button>
            </ButtonGroup>
          </Paper>
        </Drawer>
      )}
    </>
  );
}
