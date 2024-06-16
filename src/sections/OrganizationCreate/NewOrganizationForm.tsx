import * as Yup from 'yup';
import { useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form';
import { ApolloError, useMutation } from '@apollo/client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { path } from 'src/routes/path';
import { useRouter } from 'src/routes/hooks';

import { gql } from 'src/__generated__/gql';
import { CreateOrganizationInput } from 'src/__generated__/graphql';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/SnackBar';
import FormProvider, { RHFTextField, RHFSelectAvatar } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  currentOrg?: CreateOrganizationInput;
};

// ----------------------------------------------------------------------

const CREATE_ORGANIZATION = gql(/* GraphQL */ `
  mutation CreateOrganization($data: CreateOrganizationInput!) {
    createOrganization(data: $data) {
      id
      name
      slug
      addresses {
        id
      }
    }
  }
`);

// ----------------------------------------------------------------------

const NewUserSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  slug: Yup.string().required('Slug is required'),
  email: Yup.string().nullable().email('Email must be a valid email address'),
  phone: Yup.string().nullable(),
  description: Yup.string().nullable(),
  // TODO: Avatar url is nullable
  avatarUrl: Yup.string().required('Avatar is required'),
  addresses: Yup.array().of(
    Yup.object().shape({
      line1: Yup.string().required('Line1 is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      zip: Yup.string().required('Zip is required'),
    })
  ),
});

export default function NewOrganizationForm({ currentOrg }: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      name: currentOrg?.name || '',
      slug: currentOrg?.slug || '',
      email: currentOrg?.email || '',
      phone: currentOrg?.phone || '',
      description: currentOrg?.description || '',
      avatarUrl: currentOrg?.avatarUrl || '',
      addresses: currentOrg?.addresses || [{ line1: '', city: '', state: '', zip: '' }],
    }),
    [currentOrg]
  );

  const [submit, { loading }] = useMutation(CREATE_ORGANIZATION);

  const form = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    fields,
    append: addAddress,
    remove: removeAddress,
  } = useFieldArray({
    control: form.control,
    name: 'addresses',
  });

  const { reset, setError, handleSubmit } = form;

  // TODO: Move to wrong validated field when validation field and tries to submit the form
  const onSubmit = handleSubmit(async (data) => {
    try {
      await submit({ variables: { data } });
      reset();
      enqueueSnackbar(currentOrg ? 'Update success!' : 'Create success!');
      router.push(path.dashboard.org.root);
    } catch (err) {
      if (err instanceof ApolloError) {
        const [error] = err.graphQLErrors;
        if (error.path?.includes('name')) {
          setError('name', { type: 'manual', message: error?.message || '' });
        }
        if (error.path?.includes('slug')) {
          setError('slug', { type: 'manual', message: error?.message || '' });
        }
      } else {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    }
  });

  return (
    <FormProvider form={form} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFSelectAvatar
                name="avatarUrl"
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Select your favorite avatar <br /> among 25 gorgeous avatars
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="subtitle2">Organization Detail</Typography>
            </Stack>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Name" required />
              <RHFTextField name="slug" label="Slug" required />

              <RHFTextField
                name="email"
                label="Email"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Iconify icon="line-md:email" />
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField
                name="phone"
                label="Phone"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Iconify icon="line-md:phone-call" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <RHFTextField
              name="description"
              label="Description"
              multiline
              rows={3}
              sx={{ mt: 3 }}
            />
          </Card>
          <Card sx={{ p: 3, mt: 3 }}>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="subtitle2">Addresses</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                You can add multiple addresses
              </Typography>
            </Stack>
            {fields.map((item, index) => (
              <Grid container spacing={3} key={item.id}>
                <Grid xs={12}>
                  <RHFTextField name={`addresses[${index}].name`} label="Address Name" required />
                </Grid>
                <Grid xs={12} sm={6}>
                  <RHFTextField name={`addresses[${index}].attention`} label="Attention" />
                </Grid>
                <Grid xs={12} sm={6}>
                  <RHFTextField name={`addresses[${index}].department`} label="Department" />
                </Grid>
                <Grid xs={12}>
                  <RHFTextField name={`addresses[${index}].line1`} label="Line1" required />
                </Grid>
                <Grid xs={12}>
                  <RHFTextField name={`addresses[${index}].line2`} label="Line2" />
                </Grid>
                <Grid xs={12} sm={4}>
                  <RHFTextField name={`addresses[${index}].city`} label="City" required />
                </Grid>
                <Grid xs={12} sm={4}>
                  <RHFTextField name={`addresses[${index}].state`} label="State" required />
                </Grid>
                <Grid xs={12} sm={4}>
                  <RHFTextField name={`addresses[${index}].zip`} label="Zip" required />
                </Grid>
                <Grid xs={12} sx={{ textAlign: 'right' }}>
                  <Button
                    color="error"
                    startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                    onClick={() => {
                      removeAddress(index);
                    }}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            ))}

            <Divider sx={{ borderStyle: 'dashed', my: 3 }} />
            <Button
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => {
                addAddress({ line1: '', city: '', state: '', zip: '' });
              }}
              sx={{ flexShrink: 0 }}
            >
              Add address
            </Button>
          </Card>
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              {!currentOrg ? 'Create Organization' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
