import { keyBy, map, forEach, uniqBy, flatMap, groupBy, mapKeys, mapValues, orderBy } from 'lodash';
import calcPercentile from 'percentile';
import config from '../config';

const getCompFunc = (keys, asc) => {
  return (a, b) => {
    for(let i = 0; i < keys.length; i++) {
      const v1 = a[keys[i]], v2 = b[keys[i]];
      if(v1 > v2) {
        return asc ? 1 : -1;
      }
      if(v1 < v2) {
        return asc ? -1 : 1;
      }
    }
    return 0;
  };
};

const getPortsStats = (ports, portCalls) => {

  const portsStats = {};
  forEach(ports, (port) => {
    portsStats[port.id] = {
      durations: [],
      arrivalsCount: 0,
      portCallsCount: 0
    };
  });

  forEach(portCalls, (portCall) => {
    if(!portCall.isOmitted) {
      portCall.duration = portCall.departure - portCall.arrival;
      portsStats[portCall.portId].durations.push(portCall.duration / 3600000);
      portsStats[portCall.portId].arrivalsCount++;
    }
    portsStats[portCall.portId].portCallsCount++;
  });

  const portPercentilesToCompute = config.ports.percentiles;
  forEach(ports, (port) => {
    const portPercentiles = calcPercentile(portPercentilesToCompute, portsStats[port.id].durations);
    portsStats[port.id].percentiles = mapKeys(portPercentiles, (value, i) => portPercentilesToCompute[i]);
  });

  return portsStats;
};

const getVesselsStats = (vessels, portCallsByVessel) => {
  const days = config.vessels.days;
  const durations = map(days, (d) => d * 24 * 3600 * 1000);
  const vesselsStats = {};
  
  forEach(vessels, (vessel) => {
    const vesselStats = (vesselsStats[vessel.imo] = {
      delaysByDay: mapValues(mapKeys(days, (v) => v), () => [])
    });
    const vesselPortCalls = portCallsByVessel[vessel.imo];
    forEach(vesselPortCalls, ({ arrival, isOmitted, logEntries }) => {
      if(isOmitted) {
        return;
      }
      let dayI = 0;
      let prevLogEntry;
      forEach(logEntries, (logEntry) => {
        if(logEntry.arrival) {
          const durationTillArrival = arrival - logEntry.createdDate;
          let delay;
          while(durationTillArrival < durations[dayI]) {
            if(prevLogEntry) {
              vesselStats.delaysByDay[days[dayI]].push(delay || (delay = Math.abs((prevLogEntry.arrival - arrival) / 3600000)));
            }
            if(++dayI === durations.length) {
              return false;
            }
          }
          prevLogEntry = logEntry;
        }
      });
      if(prevLogEntry) {
        let delay;
        for(; dayI < durations.length; dayI++) {
          vesselStats.delaysByDay[days[dayI]].push(delay || (delay = Math.abs((prevLogEntry.arrival - arrival) / 3600000)));
        }
      }
    });
  });
  
  const vesselPercentilesToCompute = config.vessels.percentiles;
  forEach(vessels, (vessel) => {
    const vesselStats = vesselsStats[vessel.imo];
    vesselStats.vesselPercentilesByDay = mapValues(vesselStats.delaysByDay, (delays) => {
      return mapKeys(calcPercentile(vesselPercentilesToCompute, delays), (value, i) => vesselPercentilesToCompute[i]);
    });
  });

  return vesselsStats;
};

export const getStats = (vessels, shedules) => {

  const portCallsByVessel = {};
  forEach(shedules, ({ portCalls }, i) => { // filling portCallsByVessel
    portCallsByVessel[vessels[i].imo] = portCalls;
  });

  forEach(vessels, (vessel, i) => { // setting vesselImo for each portCall
    forEach(shedules[i].portCalls, (portCall) => portCall.vesselImo = vessel.imo);
  });

  const portCalls = flatMap(shedules, 'portCalls');   // got all portCalls in one array
  const ports = uniqBy(map(portCalls, 'port'), 'id'); // got all ports
  
  forEach(portCalls, (portCall) => {  // normalising portCalls (remove port from it set portId instead, converted all date strings to epoch numbers, ensured logEntries are sorted)
    portCall.portId = portCall.port.id;
    portCall.arrival = new Date(portCall.arrival).getTime();
    portCall.departure = new Date(portCall.departure).getTime();
    portCall.createdDate = new Date(portCall.createdDate).getTime();
    forEach(portCall.logEntries, (logEntry) => {
      logEntry.arrival = logEntry.arrival && new Date(logEntry.arrival).getTime();
      logEntry.departure = logEntry.departure && new Date(logEntry.departure).getTime();
      logEntry.createdDate = new Date(logEntry.createdDate).getTime();
    });
    portCall.logEntries = orderBy(portCall.logEntries, ['createdDate'], ['asc']);
    delete portCall.port;
  });

  const vesselsIx = keyBy(vessels, 'imo');  // index for vessels for easy access
  const portsIx = keyBy(ports, 'id');       // index for ports for easy access

  const portCallsByPort = groupBy(portCalls, 'portId'); // portCalls per port
  
  const vesselsStats = getVesselsStats(vessels, portCallsByVessel);  // get statistics of all vessels
  
  const portsStats = getPortsStats(ports, portCalls); // get statistics of all ports

  // pick top 5 ports by arrivalsCount
  const arrivalCompFunc = getCompFunc(['arrivalsCount', 'portCallsCount'], false);
  const portsByDescArrivals = ports.slice().sort((a, b) => arrivalCompFunc(portsStats[a.id], portsStats[b.id])).slice(0, config.ports.byArrivalsTop);
  
  // pick bottom 5 ports by portCallsCount
  const portCallsCompFunc = getCompFunc(['portCallsCount', 'arrivalsCount'], true);
  const portsByAscPortCalls = ports.slice().sort((a, b) => portCallsCompFunc(portsStats[a.id], portsStats[b.id])).slice(0, config.ports.byPortCallsBottom);

  return {
    vessels,
    ports,
    portCalls,
    vesselsIx,
    portsIx,
    portCallsByVessel,
    portCallsByPort,
    vesselsStats,
    portsStats,
    portsByDescArrivals,
    portsByAscPortCalls
  };
};
