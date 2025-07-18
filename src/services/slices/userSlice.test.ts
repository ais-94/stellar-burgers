import userSlice, {
  loginUserThunk,
  registerUserThunk,
  logoutUser,
  getUserThunk,
  updateUserThunk,
  isAuthCheckedSelector,
  userSelector,
  clearErrors
} from './userSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  name: 'test',
  email: 'test@example.com'
};

describe('userSlice', () => {
  const initialState = {
    isAuthenticated: false,
    loginUserRequest: false,
    user: null,
    orders: [],
    isLoading: false,
    error: null
  };

  it('Проверка начального состояния', () => {
    expect(userSlice(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('Проверка асинхронных операций', () => {
    it('успешная авторизация пользователя', () => {
      const action = {
        type: loginUserThunk.fulfilled.type,
        payload: mockUser
      };
      const state = userSlice(initialState, action);
      expect(state).toEqual({
        ...initialState,
        user: mockUser,
        isAuthenticated: true,
        loginUserRequest: false
      });
    });

    it('обработка успешного выхода пользователя', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true
      };
      const action = { type: logoutUser.pending.type };
      const state = userSlice(stateWithUser, action);
      expect(state).toEqual({
        ...initialState,
        user: null,
        isAuthenticated: false,
        loginUserRequest: false
      });
    });
  });

  describe('Проверка действий', () => {
    it('сброс ошибки авторизации', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error'
      };
      const state = userSlice(stateWithError, clearErrors());
      expect(state.error).toBeNull();
    });
  });

  describe('Проверка селекторов', () => {
    const state = {
      user: {
        isAuthenticated: true,
        user: mockUser,
        loginUserRequest: true,
        orders: [],
        isLoading: false,
        error: null
      }
    };

    it('возврат статуса авторизации', () => {
      expect(isAuthCheckedSelector(state)).toBe(true);
    });

    it('возврат данных пользователя', () => {
      expect(userSelector(state)).toEqual(mockUser);
    });
  });
});
