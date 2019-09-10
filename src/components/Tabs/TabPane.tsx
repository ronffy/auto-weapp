import React, { SFC, ReactNode, CSSProperties } from 'react';

export type Props = {
  key: string | number | symbol
  children: ReactNode
  tab: React.ReactNode
  style?: CSSProperties
  className?: string
}

const TabPane: SFC<Props> = ({ children, style, className }) => (
  <div style={style} className={className}>
    {children}
  </div>
)

export default TabPane;
