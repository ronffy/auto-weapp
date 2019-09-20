
import React from 'react';
import UpdateProject from '../containers/UpdateProject';
import UploadWeapp from '../containers/UploadWeapp';
import PreviewWeapp from '../containers/PreviewWeapp';
import Tabs, { TabPane } from '../components/Tabs';
import styles from './Content.less';

export default class Content extends React.PureComponent {
  state = {
    activeTabKey: 'previewWeapp',
  }

  handleChangeTabs = (activeKey: string) => {
    this.setState({
      activeTabKey: activeKey
    })
  }

  render() {
    const { activeTabKey } = this.state;

    return (
      <div className={styles['layout-content']}>
        <div className={styles['content-container']}>
          <div className={styles['content-view']}>
            <Tabs
              activeKey={activeTabKey}
              onChange={this.handleChangeTabs}
              paneClassName={styles['content-view-item']}
            >
              <TabPane
                key="previewWeapp"
                tab="预览"
              >
                <PreviewWeapp />
              </TabPane>
              <TabPane
                key="uploadWeapp"
                tab="上传"
              >
                <UploadWeapp />
              </TabPane>
            </Tabs>
          </div>
          <div className={styles['content-tools']}>
            <UpdateProject />
          </div>
        </div>
      </div>
    )
  }
}