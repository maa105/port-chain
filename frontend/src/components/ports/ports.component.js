import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { map } from 'lodash';

import { Table, Tag, Divider, Row, Col } from 'antd';

import './ports.component.css';

import { loadData } from '../../actions/data.actions';
import config from '../../config';
import { toFixed } from '../../utils';

const PortsPage = () => {
  const dispatch = useDispatch();
  const {
    ports,
    portsStats,
    portsByDescArrivals,
    portsByAscPortCalls,
    loading,
    loadError
  } = useSelector((state) => state.data);
  
  useEffect(() => {
    if(!loading && !ports && !loadError) {
      dispatch(loadData());
    }
  }, [loading, ports, loadError]);

  if(loadError) {
    return <div>Error Loading Data</div>;
  }

  if(!ports) {
    return null;
  }

  if(!ports.length) {
    return <div>No Ports Available</div>;
  }

  const portsColumns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: 'Percentiles',
    children: map(config.ports.percentiles, (percentile) => {
      return {
        title: percentile + 'th',
        render: (port) => <Tag>{toFixed(portsStats[port.id].percentiles[percentile])}</Tag>,
        sorter: {
          compare: (a, b) => portsStats[a.id].percentiles[percentile] - portsStats[b.id].percentiles[percentile]
        }
      };
    })
  }];
  return (
    <div className="vessels-page">
      <Row gutter={[25]}>
        <Col xs={24} lg={12}>
          <Divider orientation="left">Top 5 ports by arrivals</Divider>
          <Table dataSource={portsByDescArrivals}
            bordered
            pagination={false}
            columns={[{
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
            }, {
              title: 'Arrivals',
              render: (port) => <Tag>{portsStats[port.id].arrivalsCount}</Tag>,
            }, {
              title: 'Port Calls',
              render: (port) => <Tag>{portsStats[port.id].portCallsCount}</Tag>,
            }]}
          />
        </Col>
        <Col xs={24} lg={12}>
          <Divider orientation="left">Bottom 5 ports by port calls</Divider>
          <Table dataSource={portsByAscPortCalls}
            bordered
            pagination={false}
            columns={[{
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
            }, {
              title: 'Arrivals',
              render: (port) => <Tag>{portsStats[port.id].arrivalsCount}</Tag>,
            }, {
              title: 'Port Calls',
              render: (port) => <Tag>{portsStats[port.id].portCallsCount}</Tag>,
            }]}
          />
        </Col>
      </Row>
      <Divider orientation="left">Ports call duration</Divider>
      <Table dataSource={ports}
        bordered
        columns={portsColumns}
      />
    </div>
  );
};

export default PortsPage;
