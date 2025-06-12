import { TOrder } from '@utils-types';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface IOrderState {
  order: TOrder | null;
  orderRequest: boolean;
  error: string | null;
}

export const initialState: IOrderState = {
  order: null,
  orderRequest: false,
  error: null
};

export const screateOrder = createAsyncThunk(
  'order/create',
  async (order: string[]) => await orderBurgerApi(order)
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/getOrderById',
  async (number: number) => await getOrderByNumberApi(number)
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  selectors: {
    orderRequestSelector: (state) => state.orderRequest,
    orderSelector: (state) => state.order,
    selectOrderModalData: (state) => state.order
  },
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.orderRequest = false;
      state.error = null;
    }
  },
  extraReducers(builder) {
    builder
      // Создание заказа
      .addCase(screateOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(screateOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message!;
      })
      .addCase(screateOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.order = action.payload.order;
      })

      // Получение заказа по номеру
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderRequest = false;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      });
  }
});

export const { orderRequestSelector, orderSelector, selectOrderModalData } =
  orderSlice.selectors;
export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
