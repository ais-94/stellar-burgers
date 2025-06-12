
import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  moveIngredientUp,
  moveIngredientDown,
  deleteIngredient
} from '../../services/slices/constructorSlice';
//import { useDispatch } from 'react-redux';
import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(moveIngredientDown(index));
    };

    const handleMoveUp = () => {
      dispatch(moveIngredientUp(index));
    };

    const handleClose = () => {
      dispatch(deleteIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);


