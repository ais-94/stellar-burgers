import ingredientsSlice, {
    getIngredientsThunk,
    selectIngredients,
    selectBuns,
    selectMains,
    selectSauces,
    selectIngredientsLoading, initialState
  } from './ingredientsSlice';
  import { TIngredient } from '@utils-types';
  
  const mockIngredients: TIngredient[] = [
    {
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
    },
    {
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
    },
    {
        _id: "643d69a5c3f7b9001cfa0942",
        name: "Соус Spicy-X",
        type: "sauce",
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 30,
        price: 90,
        image: "https://code.s3.yandex.net/react/code/sauce-02.png",
        image_mobile: "https://code.s3.yandex.net/react/code/sauce-02-mobile.png",
        image_large: "https://code.s3.yandex.net/react/code/sauce-02-large.png"
        }
  ];
  
  describe('ingredientsSlice', () => {
  

    it('Проверка начального состояния', () => {
      expect(ingredientsSlice(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  
    describe('Проверка асинхронных операций', () => {
      it('Проверка асинхронных операций getIngredientsThunk.pending', () => {
        const action = { type: getIngredientsThunk.pending.type };
        const state = ingredientsSlice(initialState, action);
        expect(state).toEqual({
          ...initialState,
          loading: true
        });
      });
  
      it('Проверка getIngredientsThunk.fulfilled', () => {
        const action = {
          type: getIngredientsThunk.fulfilled.type,
          payload: mockIngredients
        };
        const state = ingredientsSlice(initialState, action);
        expect(state).toEqual({
          ...initialState,
          items: mockIngredients,
          loading: false
        });
      });
    });
  
    describe('Проверка селекторов', () => {
      const state = {
        ingredients: {
          items: mockIngredients,
          loading: false,
          error: null
        }
      };
  
      it('selectBuns: возврат булок', () => {
        const buns = selectBuns(state);
        expect(buns).toHaveLength(1);
        expect(buns[0].type).toBe('bun');
      });
  
      it('selectMains: возврат начинок', () => {
        const mains = selectMains(state);
        expect(mains).toHaveLength(1);
        expect(mains[0].type).toBe('main');
      });
    });
  });