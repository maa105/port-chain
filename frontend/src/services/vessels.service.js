import { fetch, rejectNotOk } from './fetch.service';
import config from '../config';

export const loadVessels = () => {
  return fetch(config.backend.apiPrefix + '/vessels')
  .then(rejectNotOk.body);
};
