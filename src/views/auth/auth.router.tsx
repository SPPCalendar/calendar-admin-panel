import { AdminRouterItem } from '../../router';
import Login from './Login';

const authRoutes: AdminRouterItem[] = [
  {
    path: '/login',
    element: <Login />,
    meta: {
      title: 'Login',
      key: '/login',
    },
  },
];

export default authRoutes;
