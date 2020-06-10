import React from 'react';
import { render } from '@testing-library/react';

import LayoutComponent from '../../../components/layout/layout.component';
import { Layout } from 'antd';

jest.mock('../../../components/layout/top/top.component', () => {
  return jest.fn(() => <div>Top Mock</div>)
});

jest.mock('antd', () => {
  return {
    setState: (_state) => { state = _state; },
    Layout: {
      Content: jest.fn(() => <div>Content Mock</div>),
      Header: jest.fn(() => <div>Header Mock</div>)
    }
  }
});

beforeEach(() => {
  jest.clearAllMocks();
});

it('layout renders header and content', () => {
  const component = render(
    <LayoutComponent>Content Text</LayoutComponent>
  );
  expect(component.asFragment()).toMatchSnapshot();
  
  expect(Layout.Content.mock.calls.length).toEqual(1);
  expect(Layout.Header.mock.calls.length).toEqual(1);

  const TopComponent = Layout.Header.mock.calls[0][0].children;
  const topComponent = render(
    TopComponent
  );
  expect(topComponent.asFragment()).toMatchSnapshot();

  const contentChildren = Layout.Content.mock.calls[0][0].children;
  expect(contentChildren).toEqual('Content Text');

});
