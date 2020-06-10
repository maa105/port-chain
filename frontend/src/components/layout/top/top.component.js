import React from 'react';
import { Menu } from 'antd';
import { pushRouterState } from 'react-router-maa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShip, faAnchor } from '@fortawesome/free-solid-svg-icons';

import './top.component.css';
import { useSelector } from 'react-redux';

const TopComponent = () => {
  const { page } = useSelector((state) => state.router.routerState)
  
  const selectedKeys = [];
  selectedKeys.push(page);
  
  const handleClick = ({ key }) => {
    switch(key) {
      case 'vessels':
        if(page !== 'vessels') {
          pushRouterState({ page: 'vessels' });
        }
        break;
      case 'ports':
        if(page !== 'ports') {
          pushRouterState({ page: 'ports' });
        }
        break;
      default:
        break;
    }
  }

  return (
    <Menu onClick={handleClick} selectedKeys={selectedKeys} mode="horizontal" theme="dark">
      <Menu.Item key="vessels" icon={<FontAwesomeIcon icon={faShip} />}>
        &nbsp;Vessels
      </Menu.Item>
      <Menu.Item key="ports" icon={<FontAwesomeIcon icon={faAnchor} />}>
        &nbsp;Ports
      </Menu.Item>
    </Menu>
  );
};

export default TopComponent;
