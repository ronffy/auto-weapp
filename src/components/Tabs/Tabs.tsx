import React, { ReactNode, MouseEventHandler } from 'react';
import TabPane, { Props as TabPaneProps } from './TabPane';
import TabContent from './TabContent';
import classNames from 'classnames';
import './index.less';
import styles from './Tabs.less';

type Props = Partial<{
  activeKey: string
  onChange: (activeKey: string, index: number) => void
  onTabClick: MouseEventHandler
  paneClassName?: string
}>

type State = Readonly<{
  activeKey: string
}>


function getDefaultActiveKey(props) {
  let activeKey: Props['activeKey'] = '';
  React.Children.forEach(props.children, (child) => {
    if (activeKey || !child) {
      return;
    }
    if (!child.props.disabled) {
      activeKey = child.key;
    }
  });
  return activeKey;
}


const defaultProps = {

};

class Tabs extends React.Component<Props, State> {
  static defaultProps = defaultProps;

  static TabPane = TabPane;

  constructor(props: Props) {
    super(props);
    let activeKey: State['activeKey'];
    if (props.activeKey) {
      activeKey = props.activeKey;
    } else {
      activeKey = getDefaultActiveKey(props);
    }
    this.state = {
      activeKey
    }
  }

  private handleChange = (activeKey, index) => {
    const { onChange } = this.props;
    this.setState({
      activeKey,
    })
    onChange && onChange(activeKey, index);
  }

  private renderTabs = () => {
    const { activeKey } = this.state;
    const { children, onTabClick, paneClassName } = this.props;
    let tabBar: ReactNode[] = [];
    let tabContent: ReactNode[] = [];

    React.Children.forEach(children, (child, index) => {
      if (!React.isValidElement(child)) {
        return;
      }
      const _props: TabPaneProps = child.props;
      const { tab, children } = _props;
      const _key = child.key;

      const tabBarClassName = classNames('tabs-tab', {
        'tabs-tab-active': _key === activeKey
      });
      tabBar.push(
        <div
          className={tabBarClassName}
          key={_key!}
          onClick={() => this.handleChange(_key, index)}
        >
          {tab}
        </div>
      );

      tabContent.push(
        React.cloneElement(child, {
          ..._props,
          key: _key!,
        }, <TabContent
          tabKey={_key!}
          activeKey={activeKey}
          onTabClick={onTabClick}
            className={paneClassName}
        >
            {children}
          </TabContent>)
      );
    });

    return (
      <div>
        <div className="tabs-nav clearfix">
          {tabBar}
        </div>
        <div className="tabs-content clearfix">
          {tabContent}
        </div>
      </div>
    )
  }

  render() {
    return this.renderTabs();
  }
}

export default Tabs;
