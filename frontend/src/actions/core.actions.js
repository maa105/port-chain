export const NOOP_ACTION = 'NOOP_ACTION';
export const WINDOW_RESIZE = 'WINDOW_RESIZE';
export const APP_STARTED = 'APP_STARTED';

export const noopAction = () => ({
  type: NOOP_ACTION
});

export const windowResize = (width, height) => ({
  type: WINDOW_RESIZE, width, height
});

export const appStarted = () => ({
  type: APP_STARTED
});
