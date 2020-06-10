import { getStats } from '../../utils/vessels.utils';

const getTime = (dateStr) => {
  return new Date(dateStr).getTime();
};

it('basic check', () => {

  const vessels = [
    { imo: 'imo1', name: 'one' }
  ];
  const shedules = [{
    portCalls: [
      {
        port: { id: 'port1', name: 'One' },
        arrival: '2020-01-15T00:00:00+00:00',
        departure: '2020-01-15T01:00:00+00:00',
        createdDate: '2019-01-01T00:00:00+00:00',
        logEntries: [
          { departure:'2020-01-14T00:00:00+00:00', isOmitted: null, createdDate:'2018-01-01T00:00:00.000000+00:00' },
        ]
      }
    ],
    vessel: { imo: 'imo1', name: 'one' }
  }];

  const res = getStats(vessels, shedules);
  expect(res).toEqual({
    vessels,
    ports: [{ id: 'port1', name: 'One' }],
    portCalls: [{
      portId: 'port1',
      vesselImo: 'imo1',
      arrival: getTime('2020-01-15T00:00:00+00:00'),
      departure: getTime('2020-01-15T01:00:00+00:00'),
      createdDate: getTime('2019-01-01T00:00:00+00:00'),
      duration: 3600000,
      logEntries: [
        { arrival: undefined, departure: getTime('2020-01-14T00:00:00+00:00'), isOmitted: null, createdDate: getTime('2018-01-01T00:00:00.000000+00:00') },
      ]
    }],
    vesselsIx: {
      imo1: { imo: 'imo1', name: 'one' }
    },
    portsIx: {
      port1: { id: 'port1', name: 'One' }
    },
    portCallsByVessel: {
      'imo1': [{
        portId: 'port1',
        vesselImo: 'imo1',
        arrival: getTime('2020-01-15T00:00:00+00:00'),
        departure: getTime('2020-01-15T01:00:00+00:00'),
        createdDate: getTime('2019-01-01T00:00:00+00:00'),
        duration: 3600000,
        logEntries: [
          { arrival: undefined, departure: getTime('2020-01-14T00:00:00+00:00'), isOmitted: null, createdDate: getTime('2018-01-01T00:00:00.000000+00:00') },
        ]
      }]
    },
    portCallsByPort: {
      port1: [{
        portId: 'port1',
        vesselImo: 'imo1',
        arrival: getTime('2020-01-15T00:00:00+00:00'),
        departure: getTime('2020-01-15T01:00:00+00:00'),
        createdDate: getTime('2019-01-01T00:00:00+00:00'),
        duration: 3600000,
        logEntries: [
          { arrival: undefined, departure: getTime('2020-01-14T00:00:00+00:00'), isOmitted: null, createdDate: getTime('2018-01-01T00:00:00.000000+00:00') },
        ]
      }]
    },
    vesselsStats: {
      imo1: {
        delaysByDay: {
          '14': [],
          '2': [],
          '7': [],
        },
        vesselPercentilesByDay: {
          '14': {
            '5': undefined,
            '50': undefined,
            '80': undefined,
          },
          '2': {
            '5': undefined,
            '50': undefined,
            '80': undefined,
          },
          '7': {
            '5': undefined,
            '50': undefined,
            '80': undefined,
          }
        },
      }
    },
    portsStats: {
      port1: {
        arrivalsCount: 1,
        durations: [1],
        percentiles: {
          '20': 1,
          '5': 1,
          '50': 1,
          '75': 1,
          '90': 1,
        },
        portCallsCount: 1
      }
    },
    portsByDescArrivals: [{ id: 'port1', name: 'One' }],
    portsByAscPortCalls: [{ id: 'port1', name: 'One' }]
  })
});

describe('vessels stats', () => {
  it('with exact 14,7,2 days log  entries', () => {
    const vessels = [
      { imo: 'imo1', name: 'one' }
    ];
    const shedules = [{
      portCalls: [
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-15T05:00:00+00:00', isOmitted: null, createdDate:'2020-01-01T00:00:00.000000+00:00' },
            { arrival:'2020-01-15T04:00:00+00:00', isOmitted: null, createdDate:'2020-01-08T00:00:00.000000+00:00' },
            { arrival:'2020-01-15T03:00:00+00:00', isOmitted: null, createdDate:'2020-01-13T00:00:00.000000+00:00' }
          ]
        }
      ],
      vessel: { imo: 'imo1', name: 'one' }
    }];
  
    const { vesselsStats: { imo1: vesselStats }} = getStats(vessels, shedules);
    expect(vesselStats.delaysByDay).toEqual({
      '14': [5],
      '7': [4],
      '2': [3],
    });
  });
  
  it('if 14 days - 1ms the 14 day stat wont be included', () => {
    const vessels = [
      { imo: 'imo1', name: 'one' }
    ];
    const shedules = [{
      portCalls: [
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-15T05:00:00+00:00', isOmitted: null, createdDate:'2020-01-01T00:00:00.001000+00:00' },
            { arrival:'2020-01-15T04:00:00+00:00', isOmitted: null, createdDate:'2020-01-08T00:00:00.000000+00:00' },
            { arrival:'2020-01-15T03:00:00+00:00', isOmitted: null, createdDate:'2020-01-13T00:00:00.000000+00:00' }
          ]
        }
      ],
      vessel: { imo: 'imo1', name: 'one' }
    }];
  
    const { vesselsStats: { imo1: vesselStats }} = getStats(vessels, shedules);
    expect(vesselStats.delaysByDay).toEqual({
      '14': [],
      '7': [4],
      '2': [3],
    });
  });
  
  it('if dates are older than 14 or 14<x<7 or 7<x<2 they still count', () => {
    const vessels = [
      { imo: 'imo1', name: 'one' }
    ];
    const shedules = [{
      portCalls: [
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-15T05:00:00+00:00', isOmitted: null, createdDate:'2019-01-01T00:00:00.000000+00:00' },
            { arrival:'2020-01-15T04:00:00+00:00', isOmitted: null, createdDate:'2020-01-03T00:00:00.000000+00:00' },
            { arrival:'2020-01-15T03:00:00+00:00', isOmitted: null, createdDate:'2020-01-08T00:00:00.001000+00:00' }
          ]
        }
      ],
      vessel: { imo: 'imo1', name: 'one' }
    }];
  
    const { vesselsStats: { imo1: vesselStats }} = getStats(vessels, shedules);
    expect(vesselStats.delaysByDay).toEqual({
      '14': [5],
      '7': [4],
      '2': [3],
    });
  });
  
  it('if multiple entries lies before 14 or between (14,7) or between (7,2) the last one is taken', () => {
    const vessels = [
      { imo: 'imo1', name: 'one' }
    ];
    const shedules = [{
      portCalls: [
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-15T07:00:00+00:00', isOmitted: null, createdDate:'2019-01-01T00:00:00.000000+00:00' },
            { arrival:'2020-01-15T06:00:00+00:00', isOmitted: null, createdDate:'2019-12-31T00:00:00.000000+00:00' },
            { arrival:'2020-01-15T05:30:00+00:00', isOmitted: null, createdDate:'2020-01-01T00:00:00.001000+00:00' },
            { arrival:'2020-01-15T05:00:00+00:00', isOmitted: null, createdDate:'2020-01-01T00:00:00.000000+00:00' },
  
            { arrival:'2020-01-15T10:00:00+00:00', isOmitted: null, createdDate:'2020-01-01T00:00:00.001000+00:00' },
            { arrival:'2020-01-15T09:00:00+00:00', isOmitted: null, createdDate:'2020-01-04T00:00:00.000000+00:00' },
            { arrival:'2020-01-15T08:00:00+00:00', isOmitted: null, createdDate:'2020-01-08T00:00:00.001000+00:00' },
            { arrival:'2020-01-15T04:00:00+00:00', isOmitted: null, createdDate:'2020-01-08T00:00:00.000000+00:00' },
  
            { arrival:'2020-01-15T10:15:00+00:00', isOmitted: null, createdDate:'2020-01-08T00:00:00.001000+00:00' },
            { arrival:'2020-01-15T09:15:00+00:00', isOmitted: null, createdDate:'2020-01-10T00:00:00.000000+00:00' },
            { arrival:'2020-01-15T08:15:00+00:00', isOmitted: null, createdDate:'2020-01-13T00:00:00.001000+00:00' },
            { arrival:'2020-01-15T03:00:00+00:00', isOmitted: null, createdDate:'2020-01-13T00:00:00.000000+00:00' },
          ]
        }
      ],
      vessel: { imo: 'imo1', name: 'one' }
    }];
  
    const { vesselsStats: { imo1: vesselStats }} = getStats(vessels, shedules);
    expect(vesselStats.delaysByDay).toEqual({
      '14': [5],
      '7': [4],
      '2': [3],
    });
  });
  
  it('entries after 2 days changes nothing', () => {
    const vessels = [
      { imo: 'imo1', name: 'one' }
    ];
    const shedules = [{
      portCalls: [
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-15T05:00:00+00:00', isOmitted: null, createdDate:'2020-01-01T00:00:00.000000+00:00' },
            { arrival:'2020-01-15T04:00:00+00:00', isOmitted: null, createdDate:'2020-01-08T00:00:00.000000+00:00' },
            { arrival:'2020-01-15T03:00:00+00:00', isOmitted: null, createdDate:'2020-01-13T00:00:00.000000+00:00' },
            { arrival:'2020-01-15T00:00:00+00:00', isOmitted: null, createdDate:'2020-01-14T00:00:00.000000+00:00' },
            { arrival:'2020-01-15T00:00:00+00:00', isOmitted: null, createdDate:'2020-01-14T12:00:00.000000+00:00' },
            { arrival:'2020-01-15T00:00:00+00:00', isOmitted: null, createdDate:'2020-01-14T23:59:59.000000+00:00' },
          ]
        }
      ],
      vessel: { imo: 'imo1', name: 'one' }
    }];
  
    const { vesselsStats: { imo1: vesselStats }} = getStats(vessels, shedules);
    expect(vesselStats.delaysByDay).toEqual({
      '14': [5],
      '7': [4],
      '2': [3],
    });
  });
  
  it('delay is taken as absolute value', () => {
    const vessels = [
      { imo: 'imo1', name: 'one' }
    ];
    const shedules = [{
      portCalls: [
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-14T19:00:00+00:00', isOmitted: null, createdDate:'2020-01-01T00:00:00.000000+00:00' },
            { arrival:'2020-01-14T20:00:00+00:00', isOmitted: null, createdDate:'2020-01-08T00:00:00.000000+00:00' },
            { arrival:'2020-01-14T21:00:00+00:00', isOmitted: null, createdDate:'2020-01-13T00:00:00.000000+00:00' },
          ]
        }
      ],
      vessel: { imo: 'imo1', name: 'one' }
    }];
  
    const { vesselsStats: { imo1: vesselStats }} = getStats(vessels, shedules);
    expect(vesselStats.delaysByDay).toEqual({
      '14': [5],
      '7': [4],
      '2': [3],
    });
  });
  
  it('log entries with no arrival dates dont count even if createdDate is closer to 14,7,2', () => {
    const vessels = [
      { imo: 'imo1', name: 'one' }
    ];
    const shedules = [{
      portCalls: [
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-14T19:00:00+00:00', isOmitted: null, createdDate:'2019-01-01T00:00:00.000000+00:00' },
            { departure:'2020-01-15T12:00:00+00:00', isOmitted: null, createdDate:'2020-01-01T00:00:00.000000+00:00' },
            { arrival:'2020-01-14T20:00:00+00:00', isOmitted: null, createdDate:'2020-01-05T00:00:00.000000+00:00' },
            { departure:'2020-01-15T12:00:00+00:00', isOmitted: null, createdDate:'2020-01-08T00:00:00.000000+00:00' },
            { arrival:'2020-01-14T21:00:00+00:00', isOmitted: null, createdDate:'2020-01-10T00:00:00.000000+00:00' },
            { departure:'2020-01-15T12:00:00+00:00', isOmitted: null, createdDate:'2020-01-13T00:00:00.000000+00:00' },
          ]
        }
      ],
      vessel: { imo: 'imo1', name: 'one' }
    }];
  
    const { vesselsStats: { imo1: vesselStats }} = getStats(vessels, shedules);
    expect(vesselStats.delaysByDay).toEqual({
      '14': [5],
      '7': [4],
      '2': [3],
    });
  });
  
  it('omitted portCalls wont be counted', () => {
    const vessels = [
      { imo: 'imo1', name: 'one' }
    ];
    const shedules = [{
      portCalls: [
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          isOmitted: true,
          logEntries: [
            { arrival:'2020-01-14T19:00:00+00:00', isOmitted: null, createdDate:'2020-01-01T00:00:00.000000+00:00' },
            { arrival:'2020-01-14T20:00:00+00:00', isOmitted: null, createdDate:'2020-01-08T00:00:00.000000+00:00' },
            { arrival:'2020-01-14T21:00:00+00:00', isOmitted: null, createdDate:'2020-01-13T00:00:00.000000+00:00' },
          ]
        }
      ],
      vessel: { imo: 'imo1', name: 'one' }
    }];
  
    const { vesselsStats: { imo1: vesselStats }} = getStats(vessels, shedules);
    expect(vesselStats.delaysByDay).toEqual({
      '14': [],
      '7': [],
      '2': [],
    });
  });
  
  it('if no log entries between 14 an 7, 7 will take the 14 delay', () => {
    const vessels = [
      { imo: 'imo1', name: 'one' }
    ];
    const shedules = [{
      portCalls: [
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-15T05:00:00+00:00', isOmitted: null, createdDate:'2019-01-01T00:00:00.000000+00:00' },
            { arrival:'2020-01-15T03:00:00+00:00', isOmitted: null, createdDate:'2020-01-13T00:00:00.000000+00:00' },
          ]
        }
      ],
      vessel: { imo: 'imo1', name: 'one' }
    }];
  
    const { vesselsStats: { imo1: vesselStats }} = getStats(vessels, shedules);
    expect(vesselStats.delaysByDay).toEqual({
      '14': [5],
      '7': [5],
      '2': [3],
    });
  });
  
  it('if no log entries between 7 and 2, 2 will take the 7 delay', () => {
    const vessels = [
      { imo: 'imo1', name: 'one' }
    ];
    const shedules = [{
      portCalls: [
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-15T05:00:00+00:00', isOmitted: null, createdDate:'2019-01-01T00:00:00.000000+00:00' },
            { arrival:'2020-01-15T04:00:00+00:00', isOmitted: null, createdDate:'2020-01-05T00:00:00.000000+00:00' },
          ]
        }
      ],
      vessel: { imo: 'imo1', name: 'one' }
    }];
  
    const { vesselsStats: { imo1: vesselStats }} = getStats(vessels, shedules);
    expect(vesselStats.delaysByDay).toEqual({
      '14': [5],
      '7': [4],
      '2': [4],
    });
  });
  
  it('if no log entries between 14 and 2, both 7 and 2 will take the 14 delay', () => {
    const vessels = [
      { imo: 'imo1', name: 'one' }
    ];
    const shedules = [{
      portCalls: [
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-15T06:00:00+00:00', isOmitted: null, createdDate:'2019-01-01T00:00:00.000000+00:00' },
            { arrival:'2020-01-15T05:00:00+00:00', isOmitted: null, createdDate:'2019-10-01T00:00:00.000000+00:00' },
          ]
        }
      ],
      vessel: { imo: 'imo1', name: 'one' }
    }];
  
    const { vesselsStats: { imo1: vesselStats }} = getStats(vessels, shedules);
    expect(vesselStats.delaysByDay).toEqual({
      '14': [5],
      '7': [5],
      '2': [5],
    });
  });
  
  it('if no log entries none will be counted', () => {
    const vessels = [
      { imo: 'imo1', name: 'one' }
    ];
    const shedules = [{
      portCalls: [
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
          ]
        }
      ],
      vessel: { imo: 'imo1', name: 'one' }
    }];
  
    const { vesselsStats: { imo1: vesselStats }} = getStats(vessels, shedules);
    expect(vesselStats.delaysByDay).toEqual({
      '14': [],
      '7': [],
      '2': [],
    });
  });
  
  it('if no log entries >= 14 14 wont be counted', () => {
    const vessels = [
      { imo: 'imo1', name: 'one' }
    ];
    const shedules = [{
      portCalls: [
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-15T04:00:00+00:00', isOmitted: null, createdDate:'2020-01-08T00:00:00.000000+00:00' },
            { arrival:'2020-01-15T03:00:00+00:00', isOmitted: null, createdDate:'2020-01-13T00:00:00.000000+00:00' },
          ]
        }
      ],
      vessel: { imo: 'imo1', name: 'one' }
    }];
  
    const { vesselsStats: { imo1: vesselStats }} = getStats(vessels, shedules);
    expect(vesselStats.delaysByDay).toEqual({
      '14': [],
      '7': [4],
      '2': [3],
    });
  });
  
  it('if no log entries >= 7, 14 and 7 wont be counted', () => {
    const vessels = [
      { imo: 'imo1', name: 'one' }
    ];
    const shedules = [{
      portCalls: [
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-15T03:00:00+00:00', isOmitted: null, createdDate:'2020-01-13T00:00:00.000000+00:00' },
            { arrival:'2020-01-15T03:00:00+00:00', isOmitted: null, createdDate:'2020-01-14T00:00:00.000000+00:00' },
          ]
        }
      ],
      vessel: { imo: 'imo1', name: 'one' }
    }];
  
    const { vesselsStats: { imo1: vesselStats }} = getStats(vessels, shedules);
    expect(vesselStats.delaysByDay).toEqual({
      '14': [],
      '7': [],
      '2': [3],
    });
  });
  
  it('calculates percentiles correctly', () => {
    const vessels = [
      { imo: 'imo1', name: 'one' }
    ];
    const shedules = [{
      portCalls: [
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-15T01:00:00+00:00', isOmitted: null, createdDate:'2019-01-14T00:00:00.000000+00:00' }
          ]
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-15T02:00:00+00:00', isOmitted: null, createdDate:'2019-01-14T00:00:00.000000+00:00' }
          ]
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-15T03:00:00+00:00', isOmitted: null, createdDate:'2019-01-14T00:00:00.000000+00:00' }
          ]
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-15T04:00:00+00:00', isOmitted: null, createdDate:'2019-01-14T00:00:00.000000+00:00' }
          ]
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-15T05:00:00+00:00', isOmitted: null, createdDate:'2019-01-14T00:00:00.000000+00:00' }
          ]
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-15T06:00:00+00:00', isOmitted: null, createdDate:'2019-01-14T00:00:00.000000+00:00' }
          ]
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-15T07:00:00+00:00', isOmitted: null, createdDate:'2019-01-14T00:00:00.000000+00:00' }
          ]
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-15T08:00:00+00:00', isOmitted: null, createdDate:'2019-01-14T00:00:00.000000+00:00' }
          ]
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-15T09:00:00+00:00', isOmitted: null, createdDate:'2019-01-14T00:00:00.000000+00:00' }
          ]
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: [
            { arrival:'2020-01-15T10:00:00+00:00', isOmitted: null, createdDate:'2019-01-14T00:00:00.000000+00:00' }
          ]
        },
      ],
      vessel: { imo: 'imo1', name: 'one' }
    }];
  
    const { vesselsStats: { imo1: vesselStats }} = getStats(vessels, shedules);
    expect(vesselStats.vesselPercentilesByDay).toEqual({
      '14': {
        5: 1,
        50: 5,
        80: 8
      },
      '7': {
        5: 1,
        50: 5,
        80: 8
      },
      '2': {
        5: 1,
        50: 5,
        80: 8
      },
    });
  });
});

describe('ports stats', () => {
  it('logs durations correctly', () => {
    const vessels = [
      { imo: 'imo1', name: 'one' }
    ];
    const shedules = [{
      portCalls: [
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: []
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T02:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: []
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T02:15:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: []
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T02:18:21+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: []
        },
      ],
      vessel: { imo: 'imo1', name: 'one' }
    }];
  
    const { portsStats: { port1: portStats }} = getStats(vessels, shedules);
    expect(portStats.durations).toEqual([
      1,
      2,
      2.25,
      (2 * 3600 + 18 * 60 + 21) / 3600
    ]);
  });

  it('omited port calls wont be counted and wont have their durations loged', () => {
    const vessels = [
      { imo: 'imo1', name: 'one' }
    ];
    const shedules = [{
      portCalls: [
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          isOmitted: true,
          logEntries: []
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T02:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: []
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T02:15:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: []
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T02:18:21+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          isOmitted: true,
          logEntries: []
        },
      ],
      vessel: { imo: 'imo1', name: 'one' }
    }];
  
    const { portsStats: { port1: portStats }} = getStats(vessels, shedules);
    expect(portStats.durations).toEqual([
      2,
      2.25
    ]);
    expect(portStats.portCallsCount).toEqual(4);
    expect(portStats.arrivalsCount).toEqual(2);
  });

  it('computes percentiles correctly', () => {
    const vessels = [
      { imo: 'imo1', name: 'one' }
    ];
    const shedules = [{
      portCalls: [
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T01:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: []
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T02:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: []
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T03:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: []
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T04:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: []
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T05:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: []
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T06:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: []
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T07:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: []
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T08:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: []
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T09:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: []
        },
        {
          port: { id: 'port1', name: 'One' },
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T10:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: []
        }
      ],
      vessel: { imo: 'imo1', name: 'one' }
    }];
  
    const { portsStats: { port1: portStats }} = getStats(vessels, shedules);
    expect(portStats.percentiles).toEqual({
      '5': 1,
      '20': 2,
      '50': 5,
      '75': 8,
      '90': 9
    });
  });

  it('computes percentiles correctly', () => {
    const vessels = [
      { imo: 'imo1', name: 'one' }
    ];
    const portCalls = [];
    const shedules = [{
      portCalls,
      vessel: { imo: 'imo1', name: 'one' }
    }];

    for(let i = 0; i < 10; i++) {
      for(let j = 0; j < 10 + 2 * i; j++) {
        portCalls.push({
          port: { id: 'port' + i, name: 'port' + i },
          isOmitted: j % 2 === 1,
          arrival: '2020-01-15T00:00:00+00:00',
          departure: '2020-01-15T10:00:00+00:00',
          createdDate: '2019-01-01T00:00:00+00:00',
          logEntries: []
        });
      }
    }
  
    const { portsByDescArrivals, portsByAscPortCalls } = getStats(vessels, shedules);
    expect(portsByDescArrivals).toEqual([
      { id: 'port9', name: 'port9' },
      { id: 'port8', name: 'port8' },
      { id: 'port7', name: 'port7' },
      { id: 'port6', name: 'port6' },
      { id: 'port5', name: 'port5' },
    ]);
    expect(portsByAscPortCalls).toEqual([
      { id: 'port0', name: 'port0' },
      { id: 'port1', name: 'port1' },
      { id: 'port2', name: 'port2' },
      { id: 'port3', name: 'port3' },
      { id: 'port4', name: 'port4' },
    ]);
  });
});
