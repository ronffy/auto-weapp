
import React from 'react';
import classNames from 'classnames';
import styles from './Label.less';

export default class Label extends React.PureComponent {

  render() {
    const { className, children, ...otherProps } = this.props;
    const classes = classNames(styles['u-label'], className);
    return (
      <label className={classes} {...otherProps}>
        {children}
      </label>
    )
  }
}
