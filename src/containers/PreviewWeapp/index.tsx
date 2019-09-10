
import React from 'react';
import Button from '../../components/Button';
import styles from './PreviewWeapp.less';

export default class PreviewWeapp extends React.PureComponent {

  render() {
    return (
      <div>
        <Button type="primary">生成小程序预览二维码</Button>
      </div>
    )
  }
}