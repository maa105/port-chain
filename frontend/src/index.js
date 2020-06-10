import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { register as registerSW } from './serviceWorker';

import 'antd/dist/antd.css';
import './index.css';

import store, { epicMiddleware } from './store';

import AppComponent from './components/app/app.component';
import GlobalLoader from './components/global-loader/global-loader.component';

import addGlobalDispatchers from './store/global-dispatchers.store';
import connectEpicMiddleware from './store/epic-middleware.store';

connectEpicMiddleware(epicMiddleware);
addGlobalDispatchers(store);

ReactDOM.render(
  <Provider store={store}>
    <AppComponent />
    <GlobalLoader />
  </Provider>,
  document.getElementById('root')
);

registerSW();

export default store;
