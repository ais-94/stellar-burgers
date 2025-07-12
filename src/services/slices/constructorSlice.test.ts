import {
  constructorSlice,
  addIngredient,
  deleteIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  selectConstructor,
  selectConstructorBun,
  selectConstructorIngredients
} from './constructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';
import { initialState } from './orderSlice';

const mockBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockMain: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

describe('Тестирование начального состояния', () => {
  it('обрабатка начального состояния', () => {
    expect(constructorSlice.reducer(undefined, { type: 'unknown' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  describe('добавление ингредиентов', () => {
    it('добавление булки', () => {
      const action = addIngredient(mockBun);
      const state = constructorSlice.reducer(undefined, action);

      expect(state.bun).toEqual({
        ...mockBun,
        id: expect.any(String)
      });
      expect(state.ingredients).toHaveLength(0);
    });

    it('Добавление основных ингридиентов', () => {
      const action = addIngredient(mockMain);
      const state = constructorSlice.reducer(undefined, action);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toEqual([
        {
          ...mockMain,
          id: expect.any(String)
        }
      ]);
    });

    it('Замена существующей булочки', () => {
      const firstAction = addIngredient(mockBun);
      let state = constructorSlice.reducer(undefined, firstAction);

      const newBun: TIngredient = {
        ...mockBun,
        _id: '4',
        name: 'Новая булка'
      };
      const secondAction = addIngredient(newBun);
      state = constructorSlice.reducer(state, secondAction);

      expect(state.bun?.name).toBe('Новая булка');
    });
  });

  describe('Удаление ингридиента', () => {
    it('Удаление ингридиента по id', () => {
      const addAction = addIngredient(mockMain);
      let state = constructorSlice.reducer(undefined, addAction);

      const ingredientId = state.ingredients[0].id;
      const deleteAction = deleteIngredient(ingredientId);
      state = constructorSlice.reducer(state, deleteAction);

      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('перемещение ингредиента', () => {
    it('перемещение ингредиента', () => {
      const firstAction = addIngredient(mockMain);
      const secondAction = addIngredient({
        ...mockMain,
        _id: '2',
        name: 'Соус'
      });
      let state = constructorSlice.reducer(undefined, firstAction);
      state = constructorSlice.reducer(state, secondAction);

      const moveAction = moveIngredientUp(1);
      state = constructorSlice.reducer(state, moveAction);

      expect(state.ingredients[0].name).toBe('Соус');
    });
  });

  describe('Сброс конструктора', () => {
    it('Сброс конструктора', () => {
      const firstAction = addIngredient(mockBun);
      const secondAction = addIngredient(mockMain);
      let state = constructorSlice.reducer(undefined, firstAction);
      state = constructorSlice.reducer(state, secondAction);

      const clearAction = clearConstructor();
      state = constructorSlice.reducer(state, clearAction);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('Селекторы', () => {
    const stateWithItems = {
      burgerConstructor: {
        bun: { ...mockBun, id: uuidv4() },
        ingredients: [{ ...mockMain, id: uuidv4() }]
      }
    };

    it('Проверка полного состояния конструктора', () => {
      const result = selectConstructor(stateWithItems);
      expect(result).toEqual(stateWithItems.burgerConstructor);
    });

    it('Проверка получения булки', () => {
      const result = selectConstructorBun(stateWithItems);
      expect(result).toEqual(stateWithItems.burgerConstructor.bun);
    });
  });
});
