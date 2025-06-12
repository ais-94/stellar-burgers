import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

interface IFeedsState {
  orders: TOrder[];
  order: TOrder | null;
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: IFeedsState = {
  orders: [],
  order: null,
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const getFeedsThunk = createAsyncThunk('feeds/getAll', async () => {
  const response = await getFeedsApi();
  return response;
});

export const fetchOrderByNumber = createAsyncThunk(
  'feeds/getByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response;
  }
);

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {
    ordersSelector: (state) => state.orders,
    orderSelector: (state) => state.order,
    selectTotal: (state) => state.total,
    selectTotalToday: (state) => state.totalToday,
    isFeedsLoadingSelector: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeedsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeedsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты заказов';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.order = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.orders[0];
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

export const {
  ordersSelector,
  orderSelector,
  selectTotal,
  selectTotalToday,
  isFeedsLoadingSelector
} = feedsSlice.selectors;

export const feedsReducer = feedsSlice.reducer;

export default feedsSlice.reducer;