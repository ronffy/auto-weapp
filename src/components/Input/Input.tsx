
import React from 'react';
import classNames from 'classnames';
import styles from './Input.less';

export default class Input extends React.PureComponent {

  render() {
    const { className, ...otherProps } = this.props;
    const classes = classNames(styles['u-input'], className)
    return (
      <input
        className={classes}
        type="text"
        {...otherProps}
      />
    )
  }
}
