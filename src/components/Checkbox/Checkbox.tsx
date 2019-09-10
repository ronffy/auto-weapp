
import React from 'react';
import classNames from 'classnames';
import styles from './Checkbox.less';


export default class Checkbox extends React.PureComponent {

  render() {
    
    const { className, ...otherProps } = this.props;
    const classes = classNames(styles['u-checkbox'], className)
    return (
      <input
        className={classes}
        type="checkbox"
        {...otherProps}
      />
    )
  }
}
