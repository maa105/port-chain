import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { map } from 'lodash';

import { Table, Tag, Divider } from 'antd';

import './vessels.component.css';

import { loadData } from '../../actions/data.actions';
import config from '../../config';
import { toFixed } from '../../utils';


const VesselsPage = () => {
  const dispatch = useDispatch();
  const {
    vessels,
    vesselsStats,
    loading,
    loadError
  } = useSelector((state) => state.data);
  
  useEffect(() => {
    if(!loading && !vessels && !loadError) {
      dispatch(loadData());
    }
  }, [loading, vessels, loadError]);

  if(loadError) {
    return <div>Error Loading Data</div>;
  }

  if(!vessels) {
    return null;
  }

  if(!vessels.length) {
    return <div>No Vessels Available</div>;
  }

  const vesselsColumns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  ...map(config.vessels.days, (day) => {
    return         {
      title: day + ' days percentiles',
      children: map(config.vessels.percentiles, (percentile) => {
        return {
          title: percentile + 'th',
          render: (vessel) => <Tag>{toFixed(vesselsStats[vessel.imo].vesselPercentilesByDay[day][percentile])}</Tag>,
          sorter: {
            compare: (a, b) => vesselsStats[a.imo].vesselPercentilesByDay[day][percentile] - vesselsStats[b.imo].vesselPercentilesByDay[day][percentile]
          }
        };
      })
    };
  })];
  return (
    <div className="vessels-page">
      <Divider orientation="left">Vessels delays</Divider>
      <Table dataSource={vessels}
        bordered
        columns={vesselsColumns}
      />
    </div>
  );
};

export default VesselsPage;
