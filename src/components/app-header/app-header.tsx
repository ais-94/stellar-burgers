import { FC } from 'react';

import { AppHeaderUI } from '@ui';
//import { useSelector } from '../../services/store';
import { usersName } from '../../services/slices/userSlice';
import { useSelector } from 'react-redux';

export const AppHeader: FC = () => {
  const userName = useSelector(usersName);
  return <AppHeaderUI userName={userName} />;
};
