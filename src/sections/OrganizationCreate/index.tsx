import Container from '@mui/material/Container';

import { path } from 'src/routes/path';

import BreadCrumbs from 'src/components/Breadcrumbs';
import { useSettingsContext } from 'src/components/settings';

import NewOrganizationForm from './NewOrganizationForm';

// ----------------------------------------------------------------------

export default function OrganizationCreateView() {
  const settings = useSettingsContext();

  return (
    // TODO: Consider moving this Container to dashboard route definition as every page will have same layout
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <BreadCrumbs
        heading="Create a new organization"
        links={[
          {
            name: 'Organization',
            href: path.dashboard.org.root,
          },
          { name: 'New organization' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <NewOrganizationForm />
    </Container>
  );
}
