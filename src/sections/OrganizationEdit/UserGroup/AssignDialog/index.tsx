import { useLazyQuery } from '@apollo/client';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { gql } from 'src/__generated__/gql';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import SearchNotFound from 'src/components/search-not-found';
import { LoadingScreen } from 'src/components/loading-screen';

import UserItem from './UserItem';

// ----------------------------------------------------------------------

const FETCH_USERGROUP_USERS = gql(/* GraphQL */ `
  query UserGroupUsers($userGroupId: ID!, $page: Int!, $pageSize: Int!, $keyword: String) {
    userGroupUsers(userGroupId: $userGroupId, page: $page, pageSize: $pageSize, keyword: $keyword) {
      users {
        id
        name
        email
        avatarUrl
        isAssigned
      }
      total
    }
  }
`);

// ----------------------------------------------------------------------
const ITEM_HEIGHT = 64;

type Props = {
  open: boolean;
  onClose: VoidFunction;
  userGroupId: string;
};

export default function UserGroupAssignDialog({ userGroupId, open, onClose }: Props) {
  const [keyword, setKeyword] = useState('');

  const [fetchUsers, { data, loading }] = useLazyQuery(FETCH_USERGROUP_USERS);

  const handleSearchContacts = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  }, []);

  useEffect(() => {
    fetchUsers({
      variables: {
        page: 1,
        pageSize: 10,
        keyword,
        userGroupId,
      },
    });
  }, [fetchUsers, keyword, userGroupId]);

  const users = data?.userGroupUsers.users;
  const total = data?.userGroupUsers.total;
  const notFound = !users?.length && !!keyword;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>
        Users <Typography component="span">({total})</Typography>
      </DialogTitle>

      <Box sx={{ px: 3, py: 2.5 }}>
        <TextField
          fullWidth
          value={keyword}
          onChange={handleSearchContacts}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {loading && <LoadingScreen />}
        {notFound ? (
          <SearchNotFound query={keyword} sx={{ mt: 3, mb: 10 }} />
        ) : (
          <Scrollbar
            sx={{
              px: 2.5,
              height: ITEM_HEIGHT * 6,
            }}
          >
            {users?.map((user) => <UserItem key={user.id} user={user} userGroupId={userGroupId} />)}
          </Scrollbar>
        )}
      </DialogContent>
    </Dialog>
  );
}
