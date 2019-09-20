
import React, { SFC, ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './Button.less';

type Theme = 'default' | 'primary' | 'gray' | 'green'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  theme: Theme
  children: React.ReactNode
}

const Button: SFC<Props> = ({ className, children, theme = 'default', ...otherProps }) => {
  const classes = classNames(styles['u-btn'], styles[`u-btn-${theme}`], className);
  return (
    <button
      className={classes}
      {...otherProps}
    >
      {children}
    </button>
  )
}

export default Button
