import { SET_DRAWER_VISIBLE } from '../actions/layout.actions';

const layoutReducer = (
  state = { 
    drawer: {
      visible: false
    }
  },
  action,
) => {
  switch(action.type) {
    case SET_DRAWER_VISIBLE: {
      return { ...state, drawer: { ...state.drawer, visible: action.visible } };
    }
    default: {
      return state;
    }
  }
};

export default layoutReducer;
