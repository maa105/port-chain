import { LOAD_DATA, loadData } from '../../actions/data.actions';

it('load data action', () => {
  
  expect(LOAD_DATA).toEqual('data.LOAD_DATA');
  expect(loadData()).toEqual({ type: LOAD_DATA });

});
