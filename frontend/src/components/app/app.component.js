import React from 'react';
import { useSelector } from 'react-redux';

import './app.component.css';

import VesselsPage from '../vessels/vessels.component';
import PortsPage from '../ports/ports.component';

import LayoutComponent from '../layout/layout.component';

const AppComponent = () => {

  const { page } = useSelector((state) => state.router.routerState);

  return (
    <LayoutComponent>
      { page === 'vessels' ? <VesselsPage /> : null }
      { page === 'ports' ? <PortsPage /> : null }
    </LayoutComponent>
  );
};

export default AppComponent;
