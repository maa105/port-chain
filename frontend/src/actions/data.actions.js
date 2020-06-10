
export const LOAD_DATA = 'data.LOAD_DATA';
export const LOAD_DATA_STARTED = 'data.LOAD_DATA_STARTED';
export const LOAD_DATA_SUCCESSFUL = 'data.LOAD_DATA_SUCCESSFUL';
export const LOAD_DATA_ERRORED = 'data.LOAD_DATA_ERRORED';

export const loadData = () => ({
  type: LOAD_DATA
});
export const loadDataStarted = () => ({
  type: LOAD_DATA_STARTED
});
export const loadDataSuccessful = (data) => ({
  type: LOAD_DATA_SUCCESSFUL,
  data
});
export const loadDataErrored = (error) => ({
  type: LOAD_DATA_ERRORED,
  error
});
