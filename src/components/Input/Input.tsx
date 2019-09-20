
import React, { SFC, InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './Input.less';

type Theme = 'default' | 'dark'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  theme?: Theme
}

const Input: SFC<Props> = ({ className, theme = 'default', ...otherProps }) => {
  const classes = classNames(styles['u-input'], styles[`theme-${theme}`], className)
  return (
    <input
      className={classes}
      type="text"
      {...otherProps}
    />
  )
}

export default Input
