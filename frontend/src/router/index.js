import { initializeRouter as initializeRouter_maa, HASH_MAA_HISTORY_TYPE, pushTransitionAllowedCheckFunction } from 'react-router-maa';
import { changedRouterState, initRouter } from '../actions/router.actions';
import { map, filter } from 'lodash';
import { useState, useEffect, useCallback } from 'react';

export const defaultPage = 'vessels';
const parseUrl = (url) => {
  const urlSegments = map(filter(url.split(/\//gmi), (seg) => seg), (seg) => decodeURIComponent(seg));
  if(!urlSegments[0]) {
    return {
      redirect: { page: defaultPage }
    };
  }

  const state = {};

  const page = urlSegments[0].trim().toLowerCase();
  switch(page) {
    case 'vessels':
      state.page = page;
      break;
    case 'ports':
      state.page = page;
      break;
    default:
      return {
        redirect: { page: defaultPage }
      };
  }

  return state;
}

const toUrl = (state) => {
  let url = '';

  url += '/' + encodeURIComponent(state.page.toLowerCase() || defaultPage);

  return url;
};

const initializeRouter = (store) => {
  return initializeRouter_maa(parseUrl, toUrl, null, (state, position, isInit) => {
    store.dispatch(changedRouterState(state, position, isInit));
  }, (initState) => {
    return new Promise((resolve) => {
      store.dispatch(initRouter(initState, resolve));
    });
  }, 10000, '', {}, HASH_MAA_HISTORY_TYPE);
};

export const useRouteCallback = (callback, dependencies, priority = 0) => {
  const [enabled, setEnabled] = useState(true);
  const cb = useCallback(callback, dependencies);
  useEffect(() => {
    if(enabled) {
      return pushTransitionAllowedCheckFunction((e) => {
        const { popMe, ...eventArgs } = e;
        return cb(eventArgs);
      }, false, priority);
    }
  }, [cb, priority, enabled]);
  return setEnabled;
};

export default initializeRouter;
