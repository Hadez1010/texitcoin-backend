import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { useBoolean } from 'src/hooks/useBoolean';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import createData from './utils';

// ----------------------------------------------------------------------

const TABLE_DATA = [
  createData('2024-06-12', 159, 6.0, 24, 4.0),
  createData('2024-06-13', 237, 9.0, 37, 4.3),
  createData('2024-06-14', 262, 16.0, 24, 6.0),
  createData('2024-06-15', 305, 3.7, 67, 4.3),
  createData('2024-06-16', 356, 16.0, 49, 3.9),
];

export default function CollapsibleTable() {
  return (
    <TableContainer sx={{ mt: 3, overflow: 'unset' }}>
      <Scrollbar>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">Total Hash</TableCell>
              <TableCell align="left">Members</TableCell>
              <TableCell align="left">TXC</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {TABLE_DATA.map((row) => (
              <CollapsibleTableRow key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );
}

// ----------------------------------------------------------------------

type CollapsibleTableRowProps = {
  row: ReturnType<typeof createData>;
};

function CollapsibleTableRow({ row }: CollapsibleTableRowProps) {
  const collapsible = useBoolean();

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            size="small"
            color={collapsible.value ? 'inherit' : 'default'}
            onClick={collapsible.onToggle}
          >
            <Iconify
              icon={collapsible.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            />
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="left">{row.calories}</TableCell>
        <TableCell align="left">{row.fat}</TableCell>
        <TableCell align="left">{row.carbs}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={6}>
          <Collapse in={collapsible.value} unmountOnExit>
            <Paper
              variant="outlined"
              sx={{
                py: 2,
                borderRadius: 1.5,
                ...(collapsible.value && {
                  boxShadow: (theme) => theme.customShadows.z20,
                }),
              }}
            >
              <Typography variant="h6" sx={{ m: 2, mt: 0 }}>
                History
              </Typography>

              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Date</TableCell>
                    <TableCell align="left">TXC-Cold</TableCell>
                    <TableCell align="left">Hash Power</TableCell>
                    <TableCell align="left">Reward</TableCell>
                    <TableCell align="left">Share Percent</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell align="left">{historyRow.txc}</TableCell>
                      <TableCell align="left">{historyRow.hashPower}</TableCell>
                      <TableCell align="left">{historyRow.reward}</TableCell>
                      <TableCell align="left">{historyRow.sharePercent}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
