
import React, { SFC, InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './Checkbox.less';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const Checkbox: SFC<Props> = ({ className, ...otherProps }) => {
  const classes = classNames(styles['u-checkbox'], className)
  return (
    <input
      className={classes}
      type="checkbox"
      {...otherProps}
    />
  )
}

export default Checkbox
