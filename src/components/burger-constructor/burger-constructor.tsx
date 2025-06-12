import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectConstructor,
  clearConstructor
} from '../../services/slices/constructorSlice';
import {
  clearOrder,
  orderRequestSelector,
  screateOrder,
  orderSelector
} from '../../services/slices/orderSlice';
import { isAuthCheckedSelector } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const constructorItems = useSelector(selectConstructor);
  const orderRequest = useSelector(orderRequestSelector);
  const orderModalData = useSelector(orderSelector);

  const LoginAuthenticated = useSelector(isAuthCheckedSelector);


  const closeOrderModal = () => {
    dispatch(clearConstructor());
    dispatch(clearOrder());
   
    navigate('/', { replace: true });
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  const onOrderClick = () => {
    if (!LoginAuthenticated) {
      return navigate('/login');
    }

    const { bun, ingredients } = constructorItems;
    if (!constructorItems.bun || orderRequest) return;
    const orderData: string[] = [
      bun?._id!,
      ...ingredients.map((ingredient) => ingredient._id),
      bun?._id!
    ];

    
    dispatch(screateOrder(orderData));
  };

  

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
