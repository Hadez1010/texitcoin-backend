import { Helmet } from 'react-helmet-async';

import UserCreate from 'src/sections/UserCreate';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Texitcoin: New User</title>
      </Helmet>

      <UserCreate />
    </>
  );
}
