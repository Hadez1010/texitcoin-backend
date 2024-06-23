import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { path } from 'src/routes/path';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/useBoolean';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/SnackBar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/Table';

import { IUserTableFilters } from 'src/types/user';

import UserTableRow from './user-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'username', label: 'Username' },
  { id: 'assetId', label: 'AssetId', width: 180 },
  { id: 'hashPower', label: 'HashPower', width: 220 },
  { id: 'reward', label: 'Reward', width: 180 },
  { id: 'txcCold', label: 'TXC-Cold', width: 100 },
  { id: '', width: 88 },
];

const defaultFilters: IUserTableFilters = {
  username: '',
  search: '',
  status: 'all',
};

function createData(
  id: string,
  username: string,
  reward: number,
  txcCold: string,
  hashPower: number,
  assetId: string
) {
  return { id, username, reward, txcCold, hashPower, assetId };
}

const TABLE_DATA = [
  createData('23e2e32e', 'james', 19000, 'TuUhDsV4mw2V65ujSQwfboy27odR3EMQRT', 670, 'vAiqGb'),
  createData('23e2e32e', 'lissa', 38000, 'TuUhDsV4mw2V65ujSQwfboy27odR3EMQRT', 510, 'rAmptJ'),
  createData('23e2e32e', 'stepheb', 38000, 'TuUhDsV4mw2V65ujSQwfboy27odR3EMQRT', 240, 'rQvSeV'),
  createData('23e2e32e', 'tanner', 38000, 'TuUhDsV4mw2V65ujSQwfboy27odR3EMQRT', 240, 'dY4yAr'),
  createData('23e2e32e', 'kalistarner', 38000, 'TuUhDsV4mw2V65ujSQwfboy27odR3EMQRT', 490, 'cmCy1H'),
  createData('23e2e32e', 'oscar', 38000, 'TuUhDsV4mw2V65ujSQwfboy27odR3EMQRT', 870, 'syy8dc'),
  createData('23e2e32e', 'sharon', 19000, 'TuUhDsV4mw2V65ujSQwfboy27odR3EMQRT', 370, 'ts7nB2'),
  createData('23e2e32e', 'julie', 19000, 'TuUhDsV4mw2V65ujSQwfboy27odR3EMQRT', 940, 'bmR2hP'),
  createData('23e2e32e', 'kylah', 19000, 'TuUhDsV4mw2V65ujSQwfboy27odR3EMQRT', 650, 'b5FoCU'),
  createData('23e2e32e', 'randy', 19000, 'TuUhDsV4mw2V65ujSQwfboy27odR3EMQRT', 980, 'g5tcMaz'),
  createData('23e2e32e', 'leroy', 19000, 'TuUhDsV4mw2V65ujSQwfboy27odR3EMQRT', 810, 'b7Y4WF'),
  createData('23e2e32e', 'czark', 38000, 'TuUhDsV4mw2V65ujSQwfboy27odR3EMQRT', 900, 'peVuHF'),
];

// ----------------------------------------------------------------------

export default function TableList() {
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({
    defaultRowsPerPage: 10,
  });

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(TABLE_DATA);

  const [filters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      enqueueSnackbar('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, enqueueSnackbar, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(path.dashboard.user.edit(id));
    },
    [router]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Card>
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
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size="small" sx={{ minWidth: 960 }}>
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
                      dataFiltered.map((row) => row.id)
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
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}
                  <TableEmptyRows
                    height={30}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
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
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: any[];
  comparator: (a: any, b: any) => number;
  filters: IUserTableFilters;
}) {
  const { username } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (username) {
    inputData = inputData.filter(
      (user) => user.username.toLowerCase().indexOf(username.toLowerCase()) !== -1
    );
  }

  return inputData;
}
