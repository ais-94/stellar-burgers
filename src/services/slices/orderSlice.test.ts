import orderSlice, {
  screateOrder,
  fetchOrderByNumber,
  orderRequestSelector,
  orderSelector,
  selectOrderModalData,
  clearOrder
} from './orderSlice';
import { TOrder } from '@utils-types';

// моковые данные
const mockOrder: TOrder = {
  _id: '68712e335a54df001b6ddb01',
  ingredients: [
    '643d69a5c3f7b9001cfa093d',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa0942',
    '643d69a5c3f7b9001cfa094a'
  ],
  status: 'done',
  name: 'Астероидный флюоресцентный spicy био-марсианский бургер',
  createdAt: '2025-07-11T15:30:59.966Z',
  updatedAt: '2025-07-11T15:31:00.843Z',
  number: 84106
};

const mockApiResponse = {
  success: true,
  order: mockOrder
};

const mockOrderByNumberResponse = {
  success: true,
  orders: [mockOrder]
};

describe('Проверка слайса заказов', () => {
  const initialState = {
    order: null,
    orderRequest: false,
    error: null
  };

  it('возврат начального состояния', () => {
    const result = orderSlice(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('Проверка редьюсеров', () => {
    it('удаление состояня заказа при', () => {
      const state = {
        order: mockOrder,
        orderRequest: true,
        error: 'Ошибка'
      };
      const action = clearOrder();
      const result = orderSlice(state, action);
      expect(result).toEqual(initialState);
    });
  });

  describe('Проверка асинхронных операций', () => {
    it('обновление состояния при начале создания заказа', () => {
      const action = { type: screateOrder.pending.type };
      const state = orderSlice(initialState, action);
      expect(state).toEqual({
        ...initialState,
        orderRequest: true
      });
    });

    it('сохранение заказа при успешном создании', () => {
      const action = {
        type: screateOrder.fulfilled.type,
        payload: mockApiResponse
      };
      const state = orderSlice(initialState, action);
      expect(state).toEqual({
        ...initialState,
        order: mockOrder,
        orderRequest: false
      });
    });

    it('сохранение ошибки при неудачном создании заказа', () => {
      const error = { message: 'Ошибка создания заказа' };
      const action = {
        type: screateOrder.rejected.type,
        error
      };
      const state = orderSlice(initialState, action);
      expect(state).toEqual({
        ...initialState,
        orderRequest: false,
        error: 'Ошибка создания заказа'
      });
    });

    it('Проверка режима загрузки', () => {
      const action = { type: fetchOrderByNumber.pending.type };
      const state = orderSlice(initialState, action);
      expect(state).toEqual({
        ...initialState,
        orderRequest: true
      });
    });
  });

  describe('Проверка селекторов', () => {
    const testState = {
      order: {
        order: mockOrder,
        orderRequest: true,
        error: null
      }
    };

    it('возврат статуса загрузки', () => {
      expect(orderRequestSelector(testState)).toBe(true);
    });

    it('возврат данных заказа', () => {
      expect(orderSelector(testState)).toEqual(mockOrder);
    });

    it('возврат данных для модального окна', () => {
      expect(selectOrderModalData(testState)).toEqual(mockOrder);
    });
  });
  });
