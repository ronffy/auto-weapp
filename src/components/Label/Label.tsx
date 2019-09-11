
import React, { SFC, LabelHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './Label.less';

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string
  children: React.ReactNode
}

const Label: SFC<Props> = ({ className, children, ...otherProps }) => {
  const classes = classNames(styles['u-label'], className);
  return (
    <label className={classes} {...otherProps}>
      {children}
    </label>
  )
}

export default Label
