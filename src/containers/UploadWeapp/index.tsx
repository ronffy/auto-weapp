
import React from 'react';
import Button from '../../components/Button';
import { upload } from '../../cmd/weapp';
import UploadInfo from './UploadInfo';
import styles from './UploadWeapp.less';

export default class UploadWeapp extends React.PureComponent {
  state = {
    uploadSizeData: null
  }
  handleUpload = () => {
    upload({
      onProcess({ text, status }) {
        if (status === 'padding') {

        } else {

        }
      },
      onEnd: (data) => {
        if (!data) {
          return;
        }
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        this.setState({
          uploadSizeData: data
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