import { of, concat, from as observableFrom, setReturns as setRxJsReturns } from 'rxjs'
import { combineEpics, ofType } from 'redux-observable';
import { mergeMap, withLatestFrom } from 'rxjs/operators';
import { noopAction } from '../../actions/core.actions';
import { loadDataStarted, loadDataSuccessful, loadDataErrored, LOAD_DATA } from '../../actions/data.actions';
import { loadVessels, setReturns as setVesselsServiceReturns } from '../../services/vessels.service';
import { loadShedule } from '../../services/schedules.service';
import { getStats, setReturns as setVesselsUtilReturns } from '../../utils/vessels.utils';

import dataEpic from '../../epics/data.epic';

jest.mock('../../services/vessels.service', () => {
  var returns = {};
  var returnFuncs = {};
  return {
    setReturns: (rets) => {
      returns = { ...returns , ...rets };
    },
    setReturnFuncs: (retFuncs) => {
      returnFuncs = { ...returnFuncs , ...retFuncs };
    },
    loadVessels: jest.fn(() => returnFuncs.loadVessels ? returnFuncs.loadVessels() : returns.loadVessels)
  };
});
jest.mock('../../services/schedules.service', () => {
  var returns = {};
  var returnFuncs = {};
  return {
    setReturns: (rets) => {
      returns = { ...returns , ...rets };
    },
    setReturnFuncs: (retFuncs) => {
      returnFuncs = { ...returnFuncs , ...retFuncs };
    },
    loadShedule: jest.fn(() => returnFuncs.loadShedule ? returnFuncs.loadShedule() : returns.loadShedule)
  };
});
jest.mock('../../utils/vessels.utils', () => {
  var returns = {};
  var returnFuncs = {};
  return {
    setReturns: (rets) => {
      returns = { ...returns , ...rets };
    },
    setReturnFuncs: (retFuncs) => {
      returnFuncs = { ...returnFuncs , ...retFuncs };
    },
    getStats: jest.fn(() => returnFuncs.getStats ? returnFuncs.getStats() : returns.getStats)
  };
});
jest.mock('redux-observable', () => {
  var returns = {};
  var returnFuncs = {};
  return {
    setReturns: (rets) => {
      returns = { ...returns , ...rets };
    },
    setReturnFuncs: (retFuncs) => {
      returnFuncs = { ...returnFuncs , ...retFuncs };
    },
    combineEpics: jest.fn(() => {
      return returnFuncs.combineEpics ? returnFuncs.combineEpics() : returns.combineEpics;
    }),
    ofType: jest.fn(() => {
      return returnFuncs.ofType ? returnFuncs.ofType() : returns.ofType;
    })
  }
});
jest.mock('rxjs/operators', () => {
  var returns = {};
  var returnFuncs = {};
  return {
    setReturns: (rets) => {
      returns = { ...returns , ...rets };
    },
    setReturnFuncs: (retFuncs) => {
      returnFuncs = { ...returnFuncs , ...retFuncs };
    },
    withLatestFrom: jest.fn(() => {
      return returnFuncs.withLatestFrom ? returnFuncs.withLatestFrom() : returns.withLatestFrom;
    }),
    mergeMap: jest.fn(() => {
      return returnFuncs.mergeMap ? returnFuncs.mergeMap() : returns.mergeMap;
    })
  }
});
jest.mock('rxjs', () => {
  var returns = {};
  var returnFuncs = {};
  return {
    setReturns: (rets) => {
      returns = { ...returns , ...rets };
    },
    setReturnFuncs: (retFuncs) => {
      returnFuncs = { ...returnFuncs , ...retFuncs };
    },
    of: jest.fn(() => {
      return returnFuncs.of ? returnFuncs.of() : returns.of;
    }),
    concat: jest.fn(() => {
      return returnFuncs.concat ? returnFuncs.concat() : returns.concat;
    }),
    from: jest.fn(() => {
      return returnFuncs.from ? returnFuncs.from() : returns.from;
    })
  }
});

describe('data.epic', () => {
  let loadDataEpic;
  beforeAll(() => {
    loadDataEpic = combineEpics.mock.calls[0][0];
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('loadDataEpic calls action$.pipe(ofType(...), withLatestFrom(...), mergeMap(...))', async () => {
  
    const action$ = {
      pipe: jest.fn(() => 'pipe return')
    };
    const state$ = 'state$';
  
    loadDataEpic(action$, state$);
  
    expect(action$.pipe.mock.calls.length).toEqual(1);
  
    expect(ofType.mock.calls.length).toEqual(1);
    expect(ofType.mock.calls[0]).toEqual([LOAD_DATA]);
  
    expect(withLatestFrom.mock.calls.length).toEqual(1);
    expect(withLatestFrom.mock.calls[0]).toEqual([state$]);
  
    expect(mergeMap.mock.calls.length).toEqual(1);
    expect(mergeMap.mock.calls[0].length).toEqual(1);
    
    const mergeMapFunc = mergeMap.mock.calls[0][0];
    expect(typeof(mergeMapFunc)).toEqual('function');
  });
  
  it('function sent to merge map returns of(noopAction()) if vessels already loaded or if loading vessels', async () => {
    const action$ = {
      pipe: jest.fn(() => 'pipe return')
    };
    const state$ = 'state$';
  
    loadDataEpic(action$, state$);
    
    const mergeMapFunc = mergeMap.mock.calls[0][0];
    
    setRxJsReturns({ of: 'of ret' })
  
    let ret = mergeMapFunc([{}, { data: { vessels: true } }]);
    
    expect(ret).toEqual('of ret');
  
    expect(of.mock.calls.length).toEqual(1);
    expect(of.mock.calls[0][0]).toEqual(noopAction());
  
    jest.clearAllMocks();
  
    ret = mergeMapFunc([{}, { data: { loadingData: true } }]);
    
    expect(ret).toEqual('of ret');
  
    expect(of.mock.calls.length).toEqual(1);
    expect(of.mock.calls[0][0]).toEqual(noopAction());
  });
  
  it('function sent to merge map returns a concatinated observable of loadDataStarted and getStats(loadVessels,loadShedule) case successful loadVessels', async () => {
    const action$ = {
      pipe: jest.fn(() => 'pipe return')
    };
    const state$ = 'state$';
  
    loadDataEpic(action$, state$);
    
    const mergeMapFunc = mergeMap.mock.calls[0][0];
  
    const vesselsMock = { map: jest.fn(() => ['map ret']) };
    setVesselsServiceReturns({ loadVessels: Promise.resolve(vesselsMock) });
    setRxJsReturns({ concat: 'concat ret', from: 'observableFrom ret' })
    setVesselsUtilReturns({ getStats: 'getStats return' });
    let ret = mergeMapFunc([{}, { data: {} }]);
  
    expect(ret).toEqual('concat ret');
  
    expect(concat.mock.calls.length).toEqual(1);
    expect(concat.mock.calls[0]).toEqual(['of ret', 'observableFrom ret']);
  
    expect(of.mock.calls.length).toEqual(1);
    expect(of.mock.calls[0][0]).toEqual(loadDataStarted());
  
    expect(observableFrom.mock.calls.length).toEqual(1);
    expect((observableFrom.mock.calls[0][0]) instanceof Promise).toEqual(true);
  
    expect(loadVessels.mock.calls.length).toEqual(1);
  
    let result = await observableFrom.mock.calls[0][0];
    expect(result).toEqual(loadDataSuccessful('getStats return'));
  
    expect(vesselsMock.map.mock.calls.length).toEqual(1);
    const mapFunction = vesselsMock.map.mock.calls[0][0];
    
    expect(getStats.mock.calls.length).toEqual(1);
    expect(getStats.mock.calls[0]).toEqual([vesselsMock, ['map ret']]);
    
    expect(loadShedule.mock.calls.length).toEqual(0);
    mapFunction({ imo: 'IMO1' });
    expect(loadShedule.mock.calls.length).toEqual(1);
    expect(loadShedule.mock.calls[0][0]).toEqual('IMO1');
  
  });
  
  it('function sent to merge map returns a concatinated observable of loadDataStarted and loadDataErrored case unsuccessful loadVessels', async () => {
    const action$ = {
      pipe: jest.fn(() => 'pipe return')
    };
    const state$ = 'state$';
  
    loadDataEpic(action$, state$);
    
    const mergeMapFunc = mergeMap.mock.calls[0][0];
  
    setRxJsReturns({ concat: 'concat ret', from: 'observableFrom ret' })
  
    setVesselsUtilReturns({ getStats: 'getStats return' });
    setVesselsServiceReturns({ loadVessels: Promise.reject('Some ERROR') });
  
    mergeMapFunc([{}, { data: {} }]);
  
    let result = await observableFrom.mock.calls[0][0];
    expect(result).toEqual(loadDataErrored('Some ERROR'));
  
    jest.clearAllMocks();
  
    setVesselsServiceReturns({ loadVessels: Promise.reject() });
  
    mergeMapFunc([{}, { data: {} }]);
  
    result = await observableFrom.mock.calls[0][0];
    expect(result).toEqual(loadDataErrored(true));
  });
});
