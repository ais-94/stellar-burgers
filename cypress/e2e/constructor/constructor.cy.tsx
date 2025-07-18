import cypress from 'cypress';

const bunId = '[data-cy=643d69a5c3f7b9001cfa093c]';
const bunName = 'Краторная булка N-200i';
const mainId = '[data-cy=643d69a5c3f7b9001cfa0941]';
const sauceId = '[data-cy=643d69a5c3f7b9001cfa0943]';
const mainName = 'Биокотлета из марсианской Магнолии';
const sauseName = 'Соус фирменный Space Sauce';

describe('Работа конструктора', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1920, 784);
    cy.visit('/');
  });

  it('Добавление булок в конструктор', () => {
    cy.get(bunId).contains('Добавить').click();
    cy.get('[data-cy=bun-top]').contains(bunName).should('exist');
    cy.get('[data-cy=bun-bottom]').contains(bunName).should('exist');
  });

  it('Добавление ингредиентов в конструктор', () => {
    cy.get(mainId).should('exist');
    cy.get(sauceId).should('exist');
    cy.get(mainId).contains('Добавить').click();
    cy.get(sauceId).contains('Добавить').click();
    cy.get('[data-cy=constructor-ingredients-list]')
      .contains(mainName)
      .should('exist');
    cy.get('[data-cy=constructor-ingredients-list]')
      .contains(sauseName)
      .should('exist');
  });
});

describe('Работа модального окна', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });
    cy.viewport(1920, 784);
    cy.visit('/');
  });

  it('Открыть модальное окно ингредиента', () => {
    cy.contains('Детали ингредиента').should('not.exist');
    cy.contains(bunName).click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('#modals').contains(bunName).should('exist');
  });

  it('Закрыть по клику на крестик', () => {
    cy.contains(bunName).click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('[data-cy=modal_close]').click();
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('Закрыть по клику на оверлей', () => {
    cy.contains(bunName).click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('[data-cy=modal-overlay]').click('right', { force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });
});

describe('Сбор и создание заказа', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'ingredients'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'orders.json' }).as('order');

    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');
    cy.viewport(1920, 784);
    cy.visit('/');
  });

  afterEach(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Сбор бургера и оформление заказа', function () {
    cy.get(bunId).contains('Добавить').click();
    cy.get(sauceId).contains('Добавить').click();
    cy.get('[data-cy=place-an-order]').click();

    cy.wait('@order', { timeout: 10000 })
      .its('request.body')
      .should('deep.equal', {
        ingredients: [
          '643d69a5c3f7b9001cfa093c',
          '643d69a5c3f7b9001cfa0943',
          '643d69a5c3f7b9001cfa093c'
        ]
      });
    cy.get('[data-cy=modal-overlay]', { timeout: 5000 }).should('exist');
    cy.get('[data-cy=modal]', { timeout: 5000 }).should('be.visible');

    cy.get('[data-cy=ordersNumer]').as('ordersNumber');
    cy.get('@ordersNumber').contains('84527').should('exist');
    cy.get('[data-cy=modal_close]').click();
    cy.get('@ordersNumber').should('not.exist');
  });

  it('Проверка проверка отсутвия ингрeдиентов после заказа', () => {
    cy.get('[data-cy=bun-top]').should('not.exist');
    cy.get('[data-cy=bun-bottom]').should('not.exist');
    cy.get(mainId).should('not.exist');
    cy.get(sauceId).should('not.exist');
  });

  it('Создать заказ без ингредиентов', () => {
    cy.get('[data-cy=place-an-order]').should('not.exist');
  });
});
