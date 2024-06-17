// ----------------------------------------------------------------------

const ROOTS = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const path = {
  // AUTH
  login: ROOTS.LOGIN,

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    user: {
      root: `${ROOTS.DASHBOARD}/users`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/users/${id}`,
      new: `${ROOTS.DASHBOARD}/users/new`,
    },
    // org: {
    //   root: `${ROOTS.DASHBOARD}/organizations`,
    //   edit: (id: string) => `${ROOTS.DASHBOARD}/organizations/${id}`,
    //   editUserGroup: (id: string) => `${ROOTS.DASHBOARD}/organizations/${id}/user-group`,
    //   new: `${ROOTS.DASHBOARD}/organizations/new`,
    // },
  },

  notFound: '/404',
};
