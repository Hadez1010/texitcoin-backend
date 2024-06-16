import * as Yup from 'yup';
import isEqual from 'lodash/isEqual';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { gql } from 'src/__generated__/gql';
import { Address, AddressableType } from 'src/__generated__/graphql';

import { useSnackbar } from 'src/components/SnackBar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  addressableType: AddressableType;
  addressableId: string;
  address?: Address;
  onSuccess: VoidFunction;
};

// ----------------------------------------------------------------------

const UPDATE_ADDRESSES = gql(/* GraphQL */ `
  mutation UpdateAddress($data: UpdateAddressInput!) {
    updateAddress(data: $data) {
      id
      name
      attention
      department
      line1
      line2
      city
      state
      zip
    }
  }
`);

const CREATE_ADDRESSES = gql(/* GraphQL */ `
  mutation CreateAddress($data: AddressInputWithPolymorphic!) {
    createAddress(data: $data) {
      id
      name
      attention
      department
      line1
      line2
      city
      state
      zip
    }
  }
`);

// ----------------------------------------------------------------------

const addressSchema = Yup.object().shape({
  name: Yup.string().nullable(),
  attention: Yup.string().nullable(),
  department: Yup.string().nullable(),
  line1: Yup.string().required('Line1 is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zip: Yup.string().required('Zip is required'),
});

export default function AddressForm({ addressableType, addressableId, address, onSuccess }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const [updateAddress, { loading: isUpdateLoading }] = useMutation(UPDATE_ADDRESSES);
  const [createAddress, { loading: isCreateLoading }] = useMutation(CREATE_ADDRESSES);

  const form = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: address,
  });
  const { handleSubmit } = form;

  // TODO: Move to wrong validated field when validation field and tries to submit the form
  const onSubmit = handleSubmit(async (newAddress) => {
    if (isEqual(address, newAddress)) {
      enqueueSnackbar('No changes to save', { variant: 'warning' });
      return;
    }
    // Need to strip fields
    const data = await addressSchema.validate(newAddress, {
      stripUnknown: true,
    });

    if (address?.id) {
      await updateAddress({ variables: { data: { id: address.id, ...data } } });
      enqueueSnackbar('Update success!');
      onSuccess();
    } else {
      await createAddress({
        variables: {
          data: {
            ...data,
            addressableType,
            addressableId,
          },
        },
      });
      enqueueSnackbar('Create success!');
      onSuccess();
    }
  });

  return (
    <FormProvider form={form} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <RHFTextField name="name" label="Address Name" />
        </Grid>
        <Grid xs={12} sm={6}>
          <RHFTextField name="attention" label="Attention" />
        </Grid>
        <Grid xs={12} sm={6}>
          <RHFTextField name="department" label="Department" />
        </Grid>
        <Grid xs={12}>
          <RHFTextField name="line1" label="Line1" required />
        </Grid>
        <Grid xs={12}>
          <RHFTextField name="line2" label="Line2" />
        </Grid>
        <Grid xs={12} sm={4}>
          <RHFTextField name="city" label="City" required />
        </Grid>
        <Grid xs={12} sm={4}>
          <RHFTextField name="state" label="State" required />
        </Grid>
        <Grid xs={12} sm={4}>
          <RHFTextField name="zip" label="Zip" required />
        </Grid>
      </Grid>
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
  );
}
