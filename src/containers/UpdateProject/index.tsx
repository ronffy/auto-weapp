
import React from 'react';
import classNames from 'classnames';
import Button from '../../components/Button';
import Label from '../../components/Label';
import Checkbox from '../../components/Checkbox';
import Input from '../../components/Input';
import styles from './UpdateProject.less';

export default class UpdateProject extends React.PureComponent {

  render() {
    return (
      <div>
        <Label placeholder="请输入项目地址">
          项目地址:
          <Input className={classNames(styles['input-item'], styles['ml-15'])} />
        </Label>
        <Label placeholder="请输入分支名称">
          分支名称:
          <Input className={classNames(styles['input-item'], styles['ml-15'])} />
        </Label>
        <Label>
          使用Taro:
          <Checkbox className={classNames(styles['ml-15'])} />
        </Label>
        <Label >
          <Button type="primary">更新小程序</Button>
        </Label>

      </div>
    )
  }
}