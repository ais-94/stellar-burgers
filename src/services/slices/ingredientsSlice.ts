import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

interface IIngredientsState {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: IIngredientsState = {
  items: [],
  loading: false,
  error: null
};

export const getIngredientsThunk = createAsyncThunk(
  'ingredients/fetchAll',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (state) => state.items,
    selectIngredientsLoading: (state) => state.loading,
    selectBuns: (state) => state.items.filter((item) => item.type === 'bun'),
    selectMains: (state) => state.items.filter((item) => item.type === 'main'),
    selectSauces: (state) => state.items.filter((item) => item.type === 'sauce')
  },
  extraReducers(builder) {
    builder
      .addCase(getIngredientsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredientsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getIngredientsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message! || 'Ошибка загрузки';
      });
  }
});

export default ingredientsSlice.reducer;
export const {
  selectIngredients,
  selectIngredientsLoading,
  selectBuns,
  selectMains,
  selectSauces
} = ingredientsSlice.selectors;
