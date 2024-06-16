import { useMemo, useCallback } from 'react';
import { useQuery as useGraphQuery } from '@apollo/client';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { path } from 'src/routes/path';
import { useQuery } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import type { SortOrder } from 'src/routes/hooks/useQuery';

import { useBoolean } from 'src/hooks/useBoolean';

import { gql } from 'src/__generated__/gql';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import BreadCrumbs from 'src/components/Breadcrumbs';
import SearchInput from 'src/components/SearchInput';
import Label, { LabelColor } from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/Table';

import {
  OrganizationStatus,
  IOrganizationTableFilter,
  IOrganizationPrismaFilter,
} from 'src/types/organization';

import TableRow from './TableRow';
import TableFiltersResult from './TableFiltersResult';

// ----------------------------------------------------------------------

const STATUS_OPTIONS: { value: OrganizationStatus; label: string; color: LabelColor }[] = [
  { value: 'all', label: 'All', color: 'info' },
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'archived', label: 'Archived', color: 'error' },
];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', sortable: true },
  { id: 'slug', label: 'Slug', width: 220 },
  { id: 'phone', label: 'Phone', width: 130, sortable: true },
  { id: 'users', label: 'Users' },
  { id: 'createdAt', label: 'Created At', width: 140, sortable: true },
  { id: 'updatedAt', label: 'Updated At', width: 140, sortable: true },
  { id: 'deletedAt', label: 'Status', width: 95, sortable: true },
  { id: '', width: 50 },
];

const defaultFilter: IOrganizationTableFilter = {
  search: '',
  status: 'all',
};

// ----------------------------------------------------------------------

const FETCH_ORGANIZATIONS_STATS = gql(/* GraphQL */ `
  query FetchOrganizationsStats($activeFilter: JSONObject, $archivedFilter: JSONObject) {
    all: organizations {
      total
    }
    active: organizations(filter: $activeFilter) {
      total
    }
    archived: organizations(filter: $archivedFilter) {
      total
    }
  }
`);

const FETCH_ORGANIZATIONS = gql(/* GraphQL */ `
  query FetchOrganizations($page: String, $filter: JSONObject, $sort: String) {
    organizations(page: $page, filter: $filter, sort: $sort) {
      organizations {
        id
        name
        slug
        description
        email
        phone
        avatarUrl
        createdAt
        updatedAt
        deletedAt
        users {
          id
          name
          email
          avatarUrl
        }
      }
      total
    }
  }
`);

// ----------------------------------------------------------------------

export default function UserListView() {
  const table = useTable();

  const settings = useSettingsContext();

  const [query, setQuery] = useQuery<IOrganizationTableFilter>();

  const { page = { page: 1, pageSize: 10 }, sort, filter = defaultFilter } = query;

  const graphQueryFilter = useMemo(() => {
    const filterObj: IOrganizationPrismaFilter = {};
    if (filter.search) {
      filterObj.OR = [{ name: { contains: filter.search } }, { slug: { contains: filter.search } }];
    }

    if (filter.status === 'active') {
      filterObj.deletedAt = null;
    }

    if (filter.status === 'archived') {
      filterObj.deletedAt = { not: null };
    }

    return filterObj;
  }, [filter]);

  const graphQuerySort = useMemo(() => {
    if (!sort) return undefined;

    return Object.entries(sort)
      .map(([key, value]) => `${value === 'asc' ? '' : '-'}${key}`)
      .join(',');
  }, [sort]);

  const confirm = useBoolean();

  const canReset = !!filter.search;

  const { data: statsData } = useGraphQuery(FETCH_ORGANIZATIONS_STATS, {
    variables: { activeFilter: { deletedAt: null }, archivedFilter: { deletedAt: { not: null } } },
  });

  const { loading, data } = useGraphQuery(FETCH_ORGANIZATIONS, {
    variables: {
      page: page && `${page.page},${page.pageSize}`,
      filter: graphQueryFilter,
      sort: graphQuerySort,
    },
  });
  const tableData = data?.organizations!;

  const notFound =
    (canReset && !tableData?.organizations?.length) || !tableData?.organizations?.length;

  const handleTabChange = (event: React.SyntheticEvent, newValue: OrganizationStatus) => {
    setQuery({
      ...query,
      filter: { ...filter, status: newValue },
      page: { page: 1, pageSize: query.page?.pageSize ?? 10 },
    });
  };

  // TODO: DRY - repeated on user list page
  const handleSearchChange = useCallback(
    (value: string) => {
      setQuery({ ...query, filter: { ...filter, search: value } });
    },
    [setQuery, query, filter]
  );

  const handlePageChange = useCallback(
    (name: string, value: number) => {
      setQuery({ ...query, page: { ...page, [name]: value } });
    },
    [setQuery, query, page]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <BreadCrumbs
          heading="Organization"
          links={[{ name: 'Organization', href: path.dashboard.org.root }, { name: 'List' }]}
          action={
            <Button
              component={RouterLink}
              href={path.dashboard.org.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New organization
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Tabs
            value={filter.status}
            onChange={handleTabChange}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={(tab.value === filter.status && 'filled') || 'soft'}
                    color={tab.color}
                  >
                    {statsData ? statsData[tab.value].total! : 0}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <SearchInput search={filter.search} onSearchChange={handleSearchChange} />

          {canReset && !loading && (
            <TableFiltersResult results={tableData!.total!} sx={{ p: 2.5, pt: 0 }} />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={loading ? 0 : tableData!.organizations!.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData!.organizations!.map((row) => row!.id)
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
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={sort && sort[Object.keys(sort)[0]]}
                  orderBy={sort && Object.keys(sort)[0]}
                  headLabel={TABLE_HEAD}
                  rowCount={loading ? 0 : tableData!.organizations!.length}
                  numSelected={table.selected.length}
                  onSort={(id) => {
                    const isAsc = sort && sort[id] === 'asc';
                    const newSort = { [id]: isAsc ? 'desc' : ('asc' as SortOrder) };
                    setQuery({ ...query, sort: newSort });
                  }}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData!.organizations!.map((row) => row!.id)
                    )
                  }
                />

                {loading ? (
                  <LoadingScreen />
                ) : (
                  <TableBody>
                    {tableData!.organizations!.map(
                      (row) =>
                        row && (
                          <TableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row!.id)}
                            onSelectRow={() => table.onSelectRow(row!.id)}
                            // onDeleteRow={() => handleDeleteRow(row.id)}
                            // onEditRow={() => handleEditRow(row.id)}
                          />
                        )
                    )}

                    <TableNoData notFound={notFound} />
                  </TableBody>
                )}
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={loading ? 0 : tableData!.total!}
            page={loading ? 0 : page!.page - 1}
            rowsPerPage={page?.pageSize}
            onPageChange={(_, curPage) => {
              handlePageChange('page', curPage + 1);
            }}
            onRowsPerPageChange={(event) => {
              handlePageChange('pageSize', parseInt(event.target.value, 10));
            }}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      {/* <ConfirmDialog
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
      /> */}
    </>
  );
}

// ----------------------------------------------------------------------

// function applyFilter({
//   inputData,
//   comparator,
//   filters,
// }: {
//   inputData: IUserItem[];
//   comparator: (a: any, b: any) => number;
//   filters: IUserTableFilters;
// }) {
//   const { name, status, role } = filters;

//   const stabilizedThis = inputData.map((el, index) => [el, index] as const);

//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });

//   inputData = stabilizedThis.map((el) => el[0]);

//   if (name) {
//     inputData = inputData.filter(
//       (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
//     );
//   }

//   if (status !== 'all') {
//     inputData = inputData.filter((user) => user.status === status);
//   }

//   if (role.length) {
//     inputData = inputData.filter((user) => role.includes(user.role));
//   }

//   return inputData;
// }
