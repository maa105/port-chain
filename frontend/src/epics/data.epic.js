import { of, concat, from as observableFrom } from 'rxjs'
import { combineEpics, ofType } from 'redux-observable';
import { mergeMap, withLatestFrom } from 'rxjs/operators';
import { noopAction } from '../actions/core.actions';
import { loadDataStarted, loadDataSuccessful, loadDataErrored, LOAD_DATA } from '../actions/data.actions';
import { loadVessels } from '../services/vessels.service';
import { loadShedule } from '../services/schedules.service';
import { getStats } from '../utils/vessels.utils';

const loadDataEpic = (action$, state$) => {
  return action$.pipe(
    ofType(LOAD_DATA),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      if(state.data.vessels || state.data.loadingData) {
        return of(noopAction());
      }

      return concat(
        of(loadDataStarted()),
        observableFrom(
          loadVessels()
          .then((vessels) => {
            return Promise.all(vessels.map((vessel) => loadShedule(vessel.imo)))
            .then((shedules) => (
              getStats(vessels, shedules)
            ));
          })
          .then((data) => loadDataSuccessful(data))
          .catch((error) => loadDataErrored(error || true))
        )
      );

    })
  );
};

const dataEpic = combineEpics(loadDataEpic);
export default dataEpic;
