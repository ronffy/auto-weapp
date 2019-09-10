import React, { SFC, ReactNode, MouseEventHandler } from 'react';
import classNames from 'classnames';

export type Props = {
  activeKey: string | number | symbol
  tabKey: string | number | symbol
  children: ReactNode
  onTabClick?: MouseEventHandler
}

const TabContent: SFC<Props> = ({ activeKey, tabKey, onTabClick, children }) => {

  const tabContentClassName = classNames('tabs-tabpane', {
    'tabs-tabpane-active': tabKey === activeKey
  });
  let contentProps: Partial<{
    className: string,
    onClick: MouseEventHandler,
  }> = {
    className: tabContentClassName
  }
  if (onTabClick) {
    contentProps.onClick = onTabClick;
  }

  return (
    <div {...contentProps}>
      {children}
    </div>
  )

}
export default TabContent;
