
import React from 'react';
import Header from './Header';
import Content from './Content';

export default class Layout extends React.PureComponent {
  render() {
    return (
      <>
        <Header />
        <Content />
      </>
    )
  }
}