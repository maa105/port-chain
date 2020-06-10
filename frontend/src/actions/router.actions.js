export const INIT_ROUTER = 'INIT_ROUTER';
export const CHANGED_ROUTER_STATE = 'CHANGED_ROUTER_STATE';

export const initRouter = (initState, resolve) => ({
  type: INIT_ROUTER,
  initState, resolve
});

export const changedRouterState = (state, position, isInit) => ({
  type: CHANGED_ROUTER_STATE,
  state, position, isInit
});
