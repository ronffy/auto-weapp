import React, { SFC, ReactNode } from 'react';

export type Props = {
  key: string | number | symbol
  children: ReactNode
  tab: React.ReactNode
}

const TabPane: SFC<Props> = ({ children }) => (
  <>
    {children}
  </>
)

export default TabPane;
