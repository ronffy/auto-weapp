
import React from 'react';
import Button from '../../components/Button';
import styles from './UploadWeapp.less';

export default class UploadWeapp extends React.PureComponent {

  render() {
    return (
      <div>
        <Button type="primary">上传小程序代码</Button>
      </div>
    )
  }
}