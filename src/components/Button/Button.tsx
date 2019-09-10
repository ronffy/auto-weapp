
import React from 'react';
import classNames from 'classnames';
import styles from './Button.less';

export default class Button extends React.PureComponent {

  render() {
    const { className, children, type = 'default',  ...otherProps } = this.props;
    const classes = classNames(styles['u-btn'], styles[`u-btn-${type}`], className);
    return (
      <button
        className={classes}
        {...otherProps}
      >
        {children}
      </button>
    )
  }
}
