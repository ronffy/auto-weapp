
import React, { SFC, InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './Input.less';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const Input: SFC<Props> = ({ className, ...otherProps }) => {
  const classes = classNames(styles['u-input'], className)
  return (
    <input
      className={classes}
      type="text"
      {...otherProps}
    />
  )
}

export default Input
