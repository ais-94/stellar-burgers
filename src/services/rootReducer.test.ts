import { expect, test, describe } from '@jest/globals';
import { rootReducer} from './store';
import { initialState as constructorState } from './slices/constructorSlice';
import { initialState as feedsState } from './slices/feedsSlice';
import { initialState as ingredientsState } from './slices/ingredientsSlice';
import { initialState as orderState } from './slices/orderSlice';
import { initialState as userState } from './slices/userSlice';

describe('Проверка корневого редьюсера', () => {
  const expectedInitialState = {
    burgerConstructor: constructorState,
    feeds: feedsState,
    ingredients: ingredientsState,
    order: orderState,
    user: userState
  };

  test('Возврат корректного начального состояния', () => {
    const state = rootReducer(undefined, { type: '' });
    expect(state).toEqual(expectedInitialState);
  });

  test('Обработка неизвестного действия без изменений состояния', () => {
    const state = rootReducer(expectedInitialState, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(expectedInitialState);
  });

  test('комбинирование всех редьюсеров', () => {
    const state = rootReducer(undefined, { type: '' });
    expect(state).toMatchObject({
      burgerConstructor: expect.any(Object),
      feeds: expect.any(Object),
      ingredients: expect.any(Object),
      order: expect.any(Object),
      user: expect.any(Object)
    });
  });

  test('Проверка правильной типизации', () => {
    const state = rootReducer(undefined, { type: '' });
    expect(state.burgerConstructor).toEqual(constructorState);
    expect(state.feeds).toEqual(feedsState);
    expect(state.ingredients).toEqual(ingredientsState);
    expect(state.order).toEqual(orderState);
    expect(state.user).toEqual(userState);
  });
});