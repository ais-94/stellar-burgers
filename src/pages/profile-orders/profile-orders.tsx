import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
//import { useSelector } from 'react-redux';
import { useDispatch, useSelector } from '../../services/store';
import { userOrdersSelector, getOrders } from '../../services/slices/userSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(userOrdersSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
