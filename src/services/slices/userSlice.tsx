import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  TRegisterData
} from '@api';

import { TOrder, TUser } from '../../utils/types';

import { deleteCookie, setCookie } from '../../utils/cookie';

export interface UserState {
  isAuthenticated: boolean;
  loginUserRequest: boolean;
  user: TUser | null;
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  loginUserRequest: false,
  user: null,
  orders: [],
  isLoading: false,
  error: null
};

export const loginUserThunk = createAsyncThunk(
  'users/loginUser',
  ({ email, password }: { email: string; password: string }) =>
    loginUserApi({ email, password })
      .then((response) => {
        if (!response.success) {
          throw new Error('Ошибка авторизации');
        }
        localStorage.setItem('refreshToken', response.refreshToken);
        setCookie('accessToken', response.accessToken);
        return response.user;
      })
      .catch((error) => {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
        throw error;
      })
);

export const getUserThunk = createAsyncThunk('users/getUser', getUserApi);

export const updateUserThunk = createAsyncThunk(
  'users/updateUser',
  updateUserApi
);

export const registerUserThunk = createAsyncThunk(
  'user/register',
  (registerData: TRegisterData) =>
    registerUserApi(registerData)
      .then((response) => {
        if (!response.success) {
          throw new Error('Ошибка регистрации');
        }

        localStorage.setItem('refreshToken', response.refreshToken);
        setCookie('accessToken', response.accessToken);
        return response.user;
      })
      .catch((error) => {
        localStorage.removeItem('refreshToken');
        throw error;
      })
);

export const logoutUser = createAsyncThunk('users/logoutUser', async () =>
  logoutApi().then(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  })
);

export const getOrdersThunk = createAsyncThunk(
  'users/getOrdersThunk',
  getOrdersApi
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  selectors: {
    isAuthCheckedSelector: (state) => state.isAuthenticated,
    loginUserRequestSelector: (state) => state.loginUserRequest,
    userSelector: (state) => state.user,
    userOrdersSelector: (state) => state.orders,
    isLoadingSelector: (state) => state.orders,
    errorSelector: (state) => state.error,
    usersName: (state) => state.user?.name || '',
    userEmailSelector: (state) => state.user?.email || ''
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.error.message!;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
      })
      .addCase(registerUserThunk.pending, (state) => {
        state.isAuthenticated = false;
        state.loginUserRequest = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loginUserRequest = false;
        state.error = action.error.message!;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
      })
      .addCase(logoutUser.pending, (state) => {
        state.user = null;
        state.loginUserRequest = false;
        state.isAuthenticated = false;
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
      })
      .addCase(getOrdersThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrdersThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getUserThunk.pending, (state) => {
        state.loginUserRequest = true;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.user = null;
        state.loginUserRequest = false;
        state.error = action.error.message!;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.loginUserRequest = true;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.error.message!;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
      });
  }
});

export const { clearErrors } = userSlice.actions;
export const {
  isAuthCheckedSelector,
  loginUserRequestSelector,
  userSelector,
  usersName,
  userEmailSelector,
  userOrdersSelector,
  isLoadingSelector,
  errorSelector
} = userSlice.selectors;
export default userSlice.reducer;
