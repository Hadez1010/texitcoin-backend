import * as Yup from 'yup';
import isEqual from 'lodash/isEqual';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';

import { gql } from 'src/__generated__/gql';
import { UserGroup } from 'src/__generated__/graphql';

import { useSnackbar } from 'src/components/SnackBar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { UserGroupRole } from '../types';
import RoleSelectField from './RoleSelectField';

// ----------------------------------------------------------------------

const CREATE_USER_GROUP = gql(/* GraphQL */ `
  mutation CreateUserGroup($data: CreateUserGroupInput!) {
    createUserGroup(data: $data) {
      name
      permissions {
        Account
        ApprovalAmount
        BankAccount
        BatchUpload
        CreditCard
        Customer
        Report
        Vendor
      }
    }
  }
`);

const UPDATE_USER_GROUP = gql(/* GraphQL */ `
  mutation UpdateUserGroup($data: UpdateUserGroupInput!) {
    updateUserGroup(data: $data) {
      name
      permissions {
        Account
        ApprovalAmount
        BankAccount
        BatchUpload
        CreditCard
        Customer
        Report
        Vendor
      }
    }
  }
`);

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  userGroup: UserGroup;
  organizationId: string;
  isAdding?: boolean;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
}

// ----------------------------------------------------------------------

const userGroupPermissionSchema = Yup.mixed<UserGroupRole>()
  .oneOf(Object.values(UserGroupRole), 'Permission is invalid')
  .required('Permission is required');

const userGroupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  permissions: Yup.object()
    .shape({
      Report: userGroupPermissionSchema,
      Vendor: userGroupPermissionSchema,
      Account: userGroupPermissionSchema,
      Customer: userGroupPermissionSchema,
      CreditCard: userGroupPermissionSchema,
      BankAccount: userGroupPermissionSchema,
      BatchUpload: userGroupPermissionSchema,
      ApprovalAmount: Yup.number(),
    })
    .required('Permissions are required'),
});

const initialUserGroup = {
  name: '',
  permissions: {
    Report: UserGroupRole.None,
    Vendor: UserGroupRole.None,
    Account: UserGroupRole.None,
    Customer: UserGroupRole.None,
    CreditCard: UserGroupRole.None,
    BankAccount: UserGroupRole.None,
    BatchUpload: UserGroupRole.None,
    ApprovalAmount: 0,
  },
};

// ----------------------------------------------------------------------
export default function UserGroupFormDialog({
  onClose,
  onSuccess,
  userGroup,
  organizationId,
  isAdding,
  ...other
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [createUserGroup, { loading: isCreateLoading }] = useMutation(CREATE_USER_GROUP);
  const [updateUserGroup, { loading: isUpdateLoading }] = useMutation(UPDATE_USER_GROUP);

  const form = useForm({
    resolver: yupResolver(userGroupSchema),
    defaultValues: isAdding ? initialUserGroup : userGroup,
  });
  const { handleSubmit } = form;

  // TODO: Move to wrong validated field when validation field and tries to submit the form
  const onSubmit = handleSubmit(async (newUserGroup) => {
    if (!isAdding && isEqual(userGroup, newUserGroup)) {
      enqueueSnackbar('No changes to save', { variant: 'warning' });
      return;
    }

    // Need to strip fields
    const data = await userGroupSchema.validate(newUserGroup, {
      stripUnknown: true,
    });

    if (isAdding) {
      await createUserGroup({
        variables: {
          data: {
            parentId: userGroup?.id!,
            organizationId,
            ...data,
          },
        },
      });
      enqueueSnackbar('Create success!');
      onSuccess();
    } else {
      await updateUserGroup({ variables: { data: { id: userGroup.id, ...data } } });
      enqueueSnackbar('Update success!');
      onSuccess();
    }
  });
  return (
    <Dialog maxWidth="sm" onClose={onClose} {...other}>
      <DialogTitle>{isAdding ? 'New group' : userGroup?.name}</DialogTitle>

      <DialogContent sx={{ overflow: 'unset', minWidth: 400 }}>
        <FormProvider form={form} onSubmit={onSubmit}>
          <Box
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField name="name" label="Name" />
            <RHFTextField name="permissions.ApprovalAmount" label="Approval Amount" />
          </Box>

          <Stack spacing={2} sx={{ mt: 2 }}>
            <RoleSelectField name="permissions.Account" label="Account" />
            <RoleSelectField name="permissions.BankAccount" label="Bank Account" />
            <RoleSelectField name="permissions.BatchUpload" label="Batch Upload" />
            <RoleSelectField name="permissions.CreditCard" label="Credit Card" />
            <RoleSelectField name="permissions.Customer" label="Customer" />
            <RoleSelectField name="permissions.Report" label="Report" />
            <RoleSelectField name="permissions.Vendor" label="Vendor" />
          </Stack>

          <Stack alignItems="flex-end" sx={{ my: 3 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isUpdateLoading || isCreateLoading}
            >
              Save Changes
            </LoadingButton>
          </Stack>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
