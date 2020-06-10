import { CHANGED_ROUTER_STATE } from '../actions/router.actions';

const router = (state = {
  isInitialised: false,
  count: 0,
  position: 0,
  routerState: {},
}, action) => {
  switch (action.type) {
    case CHANGED_ROUTER_STATE:
      return Object.assign({}, state, { isInitialised: (state.isInitialised || action.isInit), routerState: action.state, position: state.position, count: state.count + 1 });
    default:
      return state;
  }
}

export default router;
