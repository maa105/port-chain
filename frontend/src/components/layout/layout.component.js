import React from 'react';

import './layout.component.css';

import { Layout } from 'antd';
import TopComponent from './top/top.component';

import './layout.component.css';

const { Content, Header } = Layout;

const LayoutComponent = ({ children }) => {
  return <>
    <Header><TopComponent /></Header>
    <Content>{children}</Content>
  </>;
};

export default LayoutComponent;
