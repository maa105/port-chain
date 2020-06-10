import { WINDOW_RESIZE } from '../actions/core.actions';
import { getWindowSize } from '../utils';

const coreReducer = (
  state = { 
    window: getWindowSize()
  },
  action,
) => {
  switch(action.type) {
    case WINDOW_RESIZE:
      return Object.assign({}, state, { window: { width: action.width, height: action.height } });
    default:
      return state;
  }
};

export default coreReducer;
