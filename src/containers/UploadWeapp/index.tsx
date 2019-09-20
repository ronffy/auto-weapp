
import React from 'react';
import Button from '../../components/Button';
import { upload } from '../../cmd/weapp';
import UploadInfo from './UploadInfo';
import styles from './UploadWeapp.less';

type UploadSizeData = {
  packages: any[]
  total: number
}

const initState = {
  uploadSizeData: null
}

type State = {
  uploadSizeData: UploadSizeData | null
}

export default class UploadWeapp extends React.PureComponent<any, State> {
  state: State = initState

  handleUpload = () => {
    upload({
      projectName: 'cpa',
      desc: '测试自动发布',
      version: '1.0.6',
      onProcess({ text, status }) {
        if (status === 'pending') {
        
        } else {

        }
      },
      onEnd: (data) => {
        if (!data) {
          return;
        }
        this.setState({
          uploadSizeData: JSON.parse(data)
        })
      }
    });
  }
  render() {
    const { uploadSizeData } = this.state;

    return (
      <div>
        <Button
          theme="primary"
          onClick={this.handleUpload}
        >
          上传小程序代码
        </Button>
        {
          uploadSizeData
            ? <UploadInfo packages={uploadSizeData.packages} total={uploadSizeData.total} />
            : null
        }
      </div>
    )
  }
}