import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import order from './slices/orderSlice';
import user from './slices/userSlice';
import constructorReducer from './slices/constructorSlice';
import burgerConstructor from './slices/constructorSlice';
import feeds from './slices/feedsSlice';
import ingredients from './slices/ingredientsSlice';


export const rootReducer = combineReducers({
  burgerConstructor,
  feeds,
  ingredients,
  order,
  user
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});



export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;

