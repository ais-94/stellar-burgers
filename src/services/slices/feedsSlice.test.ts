import feedsSlice, {
    getFeedsThunk,
    fetchOrderByNumber,
    ordersSelector,
    orderSelector,
    selectTotal,
    selectTotalToday,
    isFeedsLoadingSelector
  } from './feedsSlice';
  import { TOrder } from '@utils-types';
  
  const mockOrders: TOrder[] = [
    {
      _id: '687190645a54df001b6ddbc5',
      ingredients: [  "643d69a5c3f7b9001cfa093c",
        "643d69a5c3f7b9001cfa093c"],
      status: 'done',
      name: 'Краторный бургер',
      "createdAt": "2025-07-11T22:29:56.498Z",
      "updatedAt": "2025-07-11T22:29:57.274Z",
      "number": 84117
    }
  ];
  
  
  describe('feedSlice', () => {
    const initialState = {
      orders: [],
      order: null,
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null
    };
  
    it('Проверка начального состояния', () => {
      expect(feedsSlice(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  
    describe('Проверка асинхронных операций', () => {
      it('Проверка получения ленты заказов', () => {
        const action = { type: getFeedsThunk.pending.type };
        const state = feedsSlice(initialState, action);
        expect(state).toEqual({
          ...initialState,
          isLoading: true
        });
      });
  
      it('Проверка getFeedsThunk.fulfilled', () => {
        const action = {
          type: getFeedsThunk.fulfilled.type,
          payload: {
            orders: mockOrders,
            total: 100,
            totalToday: 10
          }
        };
        const state = feedsSlice(initialState, action);
        expect(state).toEqual({
          ...initialState,
          orders: mockOrders,
          total: 100,
          totalToday: 10,
          isLoading: false
        });
      });
  
      it('Проверка получения заказа по номеру', () => {
        const order = mockOrders[0];
        const action = {
          type: fetchOrderByNumber.fulfilled.type,
          payload: { orders: [order] }
        };
        const state = feedsSlice(initialState, action);
        expect(state.order).toEqual(order);
      });
    });
  
    describe('Проверка селекторов', () => {
      const state = {
        feeds: {
          orders: mockOrders,
          order: mockOrders[0],
          total: 100,
          totalToday: 10,
          isLoading: false,
          error: null
        }
      };
  
      it('Селектор для заказов', () => {
        expect(ordersSelector(state)).toEqual(mockOrders);
      });
  
      it('Селектор для общего числа заказов', () => {
        expect(selectTotal(state)).toBe(100);
      });
    });
  });