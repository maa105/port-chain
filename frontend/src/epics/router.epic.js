import { of } from 'rxjs'
import { combineEpics, ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';
import { INIT_ROUTER } from '../actions/router.actions';
import { appStarted } from '../actions/core.actions';

const initRouterEpic = (action$) => action$.pipe(
  ofType(INIT_ROUTER),
  mergeMap((action) => {
    action.resolve(action.initState.redirect);
    return of(appStarted());
  })
);

const routerEpic = combineEpics(initRouterEpic);
export default routerEpic;
