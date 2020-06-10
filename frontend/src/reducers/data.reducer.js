import { LOAD_DATA_STARTED, LOAD_DATA_SUCCESSFUL, LOAD_DATA_ERRORED } from '../actions/data.actions';

const dataReducer = (state = {
  vessels: null,
  ports: null,
  portCalls: null,
  vesselsIx: null,
  portsIx: null,
  portCallsByVessel: null,
  portCallsByPort: null,
  vesselsStats: null,
  portsStats: null,
  portsByDescArrivals: null,
  portsByAscPortCalls: null,
  loading: false,
  loadError: null
}, action) => {
  switch (action.type) {
    case LOAD_DATA_STARTED: {
      return Object.assign({}, state, {
        vessels: null,
        ports: null,
        portCalls: null,
        vesselsIx: null,
        portsIx: null,
        portCallsByVessel: null,
        portCallsByPort: null,
        vesselsStats: null,
        portsStats: null,
        portsByDescArrivals: null,
        portsByAscPortCalls: null,
        loading: true,
        loadError: action.error
      });
    }
    case LOAD_DATA_SUCCESSFUL: {
      return Object.assign({}, state, {
        ...action.data,
        loading: true,
        loadError: action.error
      });
    }
    case LOAD_DATA_ERRORED: {
      return Object.assign({}, state, {
        vessels: null,
        ports: null,
        portCalls: null,
        vesselsIx: null,
        portsIx: null,
        portCallsByVessel: null,
        portCallsByPort: null,
        vesselsStats: null,
        portsStats: null,
        portsByDescArrivals: null,
        portsByAscPortCalls: null,
        loading: false,
        loadError: action.error
      });
    }
    default: {
      return state;
    }
  }
}

export default dataReducer;
