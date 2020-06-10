import { LOAD_DATA_STARTED, LOAD_DATA_SUCCESSFUL, LOAD_DATA_ERRORED } from '../actions/data.actions';

const globalLoaderReducer = (
  state = { show: false, count: 0 },
  action,
) => {
  switch(action.type) {
    case LOAD_DATA_STARTED: {
      return { show: true, count: state.count + 1 };
    }
    case LOAD_DATA_SUCCESSFUL:
    case LOAD_DATA_ERRORED: {
      return { show: state.count > 1, count: state.count - 1 };
    }
    default: {
      return state;
    }
  }
};

export default globalLoaderReducer;
