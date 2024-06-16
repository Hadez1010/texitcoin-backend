import * as Yup from 'yup';
import isEqual from 'lodash/isEqual';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ApolloError, useMutation } from '@apollo/client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { gql } from 'src/__generated__/gql';
import { UpdateOrganizationInput } from 'src/__generated__/graphql';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/SnackBar';
import FormProvider, { RHFTextField, RHFSelectAvatar } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  currentOrg: UpdateOrganizationInput;
};

// ----------------------------------------------------------------------

const UPDATE_ORGANIZATION = gql(/* GraphQL */ `
  mutation UpdateOrganization($data: UpdateOrganizationInput!) {
    updateOrganization(data: $data) {
      id
      name
      slug
      email
      phone
      description
    }
  }
`);

// ----------------------------------------------------------------------

const OrganizationGeneralSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  slug: Yup.string().required('Slug is required'),
  // TODO: Backend throws error when receive empty string for email
  email: Yup.string().nullable().email('Email must be a valid email address'),
  phone: Yup.string().nullable(),
  description: Yup.string().nullable(),
  avatarUrl: Yup.string().nullable(),
});

export default function OrganizationGeneral({ currentOrg }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const [submit, { loading }] = useMutation(UPDATE_ORGANIZATION);

  const form = useForm({
    resolver: yupResolver(OrganizationGeneralSchema),
    defaultValues: currentOrg,
  });

  const { reset, setError, handleSubmit } = form;

  // TODO: Move to wrong validated field when validation field and tries to submit the form
  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isEqual(data, currentOrg)) {
        enqueueSnackbar('No changes to save', { variant: 'warning' });
        return;
      }

      // Need to strip fields
      const newOrganization = await OrganizationGeneralSchema.validate(data, {
        stripUnknown: true,
      });

      await submit({ variables: { data: { ...newOrganization, id: currentOrg.id } } });
      reset();
      enqueueSnackbar('Update success!');
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

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              Save Changes
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
