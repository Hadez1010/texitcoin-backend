import { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/Table';

// ----------------------------------------------------------------------

type RowDataType = {
  username: string;
  productName: string;
  date: string;
  hashPower: number;
  assetId: string;
};

function createData(
  username: string,
  productName: string,
  date: string,
  hashPower: number,
  assetId: string
) {
  return { username, productName, date, hashPower, assetId };
}

const TABLE_DATA = [
  createData('james', '(1) Share - 500mh/s Power', '2024-06-17', 670, 'vAiqGb'),
  createData('lissa', 'Free Share - 500mh/s Power', '2024-06-16', 510, 'rAmptJ'),
  createData('stepheb', 'Free Share - 500mh/s Power', '2024-06-15', 240, 'rQvSeV'),
  createData('tanner', 'Free Share - 500mh/s Power', '2024-06-14', 240, 'dY4yAr'),
  createData('kalistarner', 'Free Share - 500mh/s Power', '2024-06-13', 490, 'cmCy1H'),
  createData('oscar', 'Free Share - 500mh/s Power', '2024-06-12', 870, 'syy8dc'),
  createData('sharon', '(1) Share - 500mh/s Power', '2024-06-11', 370, 'ts7nB2'),
  createData('julie', '(1) Share - 500mh/s Power', '2024-06-10', 940, 'bmR2hP'),
  createData('kylah', '(1) Share - 500mh/s Power', '2024-06-09', 650, 'b5FoCU'),
  createData('randy', '(1) Share - 500mh/s Power', '2024-06-08', 980, 'g5tcMaz'),
  createData('leroy', '(1) Share - 500mh/s Power', '2024-06-07', 810, 'b7Y4WF'),
  createData('czark', 'Free Share - 500mh/s Power', '2024-06-06', 900, 'peVuHF'),
];

const TABLE_HEAD = [
  { id: 'username', label: 'Username', align: 'left' },
  { id: 'productName', label: 'Product Name', align: 'left' },
  { id: 'date', label: 'Date', align: 'left' },
  { id: 'hashPower', label: 'Hash Power', align: 'left' },
  { id: 'assetId', label: 'AssetID', align: 'left' },
];

// ----------------------------------------------------------------------

export default function TxcTable() {
  const table = useTable({
    defaultOrderBy: 'calories',
    defaultRowsPerPage: 10,
  });

  const [tableData, setTableData] = useState<RowDataType[]>([]);

  useEffect(() => {
    setTableData(TABLE_DATA);
  }, []);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  const denseHeight = table.dense ? 34 : 34 + 20;

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pl: 3, pr: 3, pt: 2, pb: 2 }}
      >
        <Typography variant="subtitle1">Sales</Typography>
      </Stack>

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <TableSelectedAction
          numSelected={table.selected.length}
          rowCount={dataFiltered.length}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              dataFiltered.map((row) => row.username)
            )
          }
          action={
            <Tooltip title="Delete">
              <IconButton color="primary">
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          }
        />

        <Scrollbar>
          <Table size="small" sx={{ minWidth: 800 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.username)
                )
              }
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <TableRow
                    hover
                    key={row.username}
                    onClick={() => table.onSelectRow(row.username)}
                    selected={table.selected.includes(row.username)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={table.selected.includes(row.username)} />
                    </TableCell>
                    <TableCell> {row.username} </TableCell>
                    <TableCell align="left">{row.productName}</TableCell>
                    <TableCell align="left">{row.date}</TableCell>
                    <TableCell align="left">{row.hashPower}</TableCell>
                    <TableCell align="left">{row.assetId}</TableCell>
                  </TableRow>
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
              />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={dataFiltered.length}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        //
        // dense={table.dense}
        // onChangeDense={table.onChangeDense}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
}: {
  inputData: RowDataType[];
  comparator: (a: any, b: any) => number;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
