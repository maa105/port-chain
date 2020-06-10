import React from 'react';
import { render } from '@testing-library/react';

import AppComponent from '../../../components/app/app.component';
import LayoutComponent from '../../../components/layout/layout.component';
import { setState } from 'react-redux';

jest.mock('../../../components/layout/layout.component', () => {
  return jest.fn(() => <div>Layout Mock</div>)
});
jest.mock('../../../components/vessels/vessels.component.js', () => {
  return jest.fn(() => <div>Vessels Page</div>)
});
jest.mock('../../../components/ports/ports.component.js', () => {
  return jest.fn(() => <div>Ports Page</div>)
});

jest.mock('react-redux', () => {
  var state = {};
  return {
    setState: (_state) => { state = _state; },
    useSelector: jest.fn((f) => f(state))
  }
});

beforeEach(() => {
  jest.clearAllMocks();
});

it('renders nulls for invalid page', () => {
  setState({ router: { routerState: { page: 'page' } } });
  const component = render(
    <AppComponent />
  );
  expect(component.asFragment()).toMatchSnapshot();
  
  expect(LayoutComponent.mock.calls.length).toEqual(1);
  
  const [VesselsPage, PortsPage] = LayoutComponent.mock.calls[0][0].children;

  expect(VesselsPage).toEqual(null);
  expect(PortsPage).toEqual(null);
});

it('renders vessels page', () => {
  setState({ router: { routerState: { page: 'vessels' } } });
  const component = render(
    <AppComponent />
  );
  expect(component.asFragment()).toMatchSnapshot();
  
  expect(LayoutComponent.mock.calls.length).toEqual(1);
  
  const [VesselsPage, PortsPage] = LayoutComponent.mock.calls[0][0].children;

  expect(VesselsPage).not.toEqual(null);
  expect(PortsPage).toEqual(null);

  const vesselsComponent = render(VesselsPage);
  expect(vesselsComponent.asFragment()).toMatchSnapshot();
});

it('renders ports page', () => {
  setState({ router: { routerState: { page: 'ports' } } });
  const component = render(
    <AppComponent />
  );
  expect(component.asFragment()).toMatchSnapshot();
  
  expect(LayoutComponent.mock.calls.length).toEqual(1);
  
  const [VesselsPage, PortsPage] = LayoutComponent.mock.calls[0][0].children;

  expect(VesselsPage).toEqual(null);
  expect(PortsPage).not.toEqual(null);

  const portsComponent = render(PortsPage);
  expect(portsComponent.asFragment()).toMatchSnapshot();
});
