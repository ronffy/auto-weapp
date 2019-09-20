
import React from 'react';
import styles from './Header.less';

export default class Header extends React.PureComponent {

  render() {
    return (
      <div className={styles['layout-header']}>ZORO</div>
    )
  }
}