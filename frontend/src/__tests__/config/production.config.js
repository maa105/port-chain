import config from '../../config/production.config';

it('production config', () => {
  
  expect(config).toEqual({
    isProd: true,
    backend: {
      apiPrefix: 'https://import-coding-challenge-api.portchain.com/api/v2'
    },
    vessels: {
      days: [14, 7, 2],
      percentiles: [5, 50, 80]
    },
    ports: {
      percentiles: [5, 20, 50, 75, 90],
      byArrivalsTop: 5,
      byPortCallsBottom: 5,
    }
  });

});
