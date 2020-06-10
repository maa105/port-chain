import initializeRouter from '../router'
import { getWindowSize } from '../utils'
import { windowResize } from '../actions/core.actions'

const addGlobalDispatchers = (store) => {
  let debounceTimer;
  window.addEventListener('resize', () => {
    if(debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      const { width, height } = getWindowSize();
      store.dispatch(windowResize(width, height));
    }, 100);
  });

  /**
   * initialisers router
   */
  initializeRouter(store);
};
export default addGlobalDispatchers;
