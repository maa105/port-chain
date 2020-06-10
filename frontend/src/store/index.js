import { createStore as createReduxStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import { createEpicMiddleware } from 'redux-observable';

export const epicMiddleware = createEpicMiddleware();
const store = createReduxStore(
  rootReducer,
  applyMiddleware(epicMiddleware)
);

export const getStore = () => store;
export const getState = () => store.getState();
export const getDispatch = () => store.dispatch;

export default store;
