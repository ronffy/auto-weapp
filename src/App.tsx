
import React from 'react';
import Header from './layout/Header';
import Content from './layout/Content';
import './common.less';

export default class App extends React.PureComponent {

  render() {
    return (
      <>
        <Header />
        <Content />
      </>
    )
  }
}