import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './components/app/app';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './services/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
//Добавлены Provider и BrowserRouter
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
