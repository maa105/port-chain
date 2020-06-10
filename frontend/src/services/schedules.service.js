import { fetch, rejectNotOk } from './fetch.service';
import config from '../config';

export const loadShedule = (vesselImo) => {
  return fetch(config.backend.apiPrefix + '/schedule/' + encodeURIComponent(vesselImo.toString()))
  .then(rejectNotOk.body);
};
