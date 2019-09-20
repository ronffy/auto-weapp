
import React from 'react';
import Button from '../../components/Button';
import { PRE_BASE64 } from '../../config';
import { upload, preview } from '../../cmd/weapp';
import styles from './PreviewWeapp.less';

export default class PreviewWeapp extends React.PureComponent {
  state = {
    imgSrcData: ''
  }

  handlePreview = () => {

    preview({
      version: '1.0.3',
      projectName: 'cpa',
      onProcess({ text, status }) {
        if (status === 'pending') {
          console.log('loading');
          
        } else {
          console.log('loaded');
          
        }
      },
      onEnd: (data) => {
        this.setState({
          imgSrcData: data
        })
      }
    });
  }

  render() {
    const { imgSrcData } = this.state;
    return (
      <div>
        <Button
          theme="gray"
          onClick={this.handlePreview}
        >
          生成小程序预览二维码
        </Button>
        {
          imgSrcData
            ? <img src={`${PRE_BASE64}${imgSrcData}`} alt="小程序预览二维码" />
            : null
        }
      </div>
    )
  }
}
