import cypress from "cypress";

describe('Работа конструктора', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1920, 784);
    cy.visit('http://localhost:4000');
  });
  
  it('Добавление ингредиентов в конструктор', () => {
    // Добавление ингредиентов
    cy.get('[data-cy=2]').contains('Добавить').click();
    cy.get('[data-cy=4]').contains('Добавить').click();
    
    // Проверка наличия ингредиентов в конструкторе
    cy.get('[data-cy=constructor-item-2]').should('exist');
    cy.get('[data-cy=constructor-item-4]').should('exist');
  });

  it('Добавление булок в конструктор', () => {
    // Добавить булку
    cy.get('[data-cy=1]').contains('Добавить').click();
    
    // Проверка верхнюю и нижнюю булки
    cy.get('[data-cy=constructor-bun-top]').should('contain', 'Булка');
    cy.get('[data-cy=constructor-bun-bottom]').should('contain', 'Булка');
  });
});

describe('Работа модального окна', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1920, 784);
    cy.visit('http://localhost:4000');
  });

  it('Открытие и закрытие модального окна ингредиента', () => {
    // Проверка модального окна
    cy.get('[data-cy=ingredient-modal]').should('not.exist');
    
    // Открыть модальное окно
    cy.get('[data-cy=ingredient-1]').click();
    cy.get('[data-cy=ingredient-modal]').should('be.visible');
    cy.get('[data-cy=ingredient-details-name]').should('contain', 'Булка');
    
    // Закрыть по клику на крестик
    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=ingredient-modal]').should('not.exist');
    
    // Открыть модальное окно повторно
    cy.get('[data-cy=ingredient-1]').click();
    
    // Закрыть по клику на оверлей
    cy.get('[data-cy=modal-overlay]').click({ force: true });
    cy.get('[data-cy=ingredient-modal]').should('not.exist');
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');

    // Авторизуем пользователя
    window.localStorage.setItem('refreshToken', 'test-refreshToken');
    cy.setCookie('accessToken', 'test-accessToken');
    
    cy.viewport(1920, 784);
    cy.visit('http://localhost:4000');
    
    // Ожидание загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Сбор бургера и оформление заказа', () => {
    // Собираем бургер
    cy.get('[data-cy=ingredient-1]').contains('Добавить').click(); 
    cy.get('[data-cy=ingredient-2]').contains('Добавить').click(); 
    cy.get('[data-cy=ingredient-4]').contains('Добавить').click(); 
    cy.get('[data-cy=place-an-order]').click();
    
    // Оформление заказа
    cy.get('[data-cy=order-button]').click();
    
    // Проверка запроса заказа
    cy.wait('@order').its('request.body').should('deep.equal', {
      ingredients: ['1', '2', '4', '1'] 
    });
    
    // Проверка отображения номера заказа
    cy.get('[data-cy=order-number]').should('contain', '99999');
    
    // Закрыть модальное окно
    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=order-modal]').should('not.exist');
  });

  it('Проверка пустого конструктора', () => {
    cy.get('[data-cy=constructor-bun-top]').should('not.exist');
    cy.get('[data-cy=constructor-bun-bottom]').should('not.exist');
    cy.get('[data-cy=constructor-ingredients]').should('not.exist');
    });
});